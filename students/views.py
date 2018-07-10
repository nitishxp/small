# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import ast
import random

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from users.models import UserModel
from models import (
    StudentConstraintsModel,
    StudentCourseModel,
)
from constraints.models import Constraints
from instructor.models import (
    CourseModel,
    CourseHomeWorkModel,
    HomeworkGroup,
    HomeworkGroupMember,
    GroupCombinationModel,
    HomeworkGroupGrade,
    AppealGraderModel,
    PeerEvaluationModel,
)
from grade.settings import BASE_DIR
from django.db.models import Avg
from django.contrib.auth.decorators import login_required
from django.db.models import Q

# Create your views here.


@login_required(login_url='/')
def index(request):
    student_course = StudentCourseModel.objects.filter(user=request.user)
    return render(request, 'student.html', {
        'student_course': student_course,
        'user': request.user
    })


@login_required(login_url='/')
def update_profile(request):
    if request.method == "POST":
        user = UserModel.objects.get(pk=request.user.id)
        user.name = request.POST['name']
        user.gender = request.POST['gender']
        user.save()

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def change_password(request):
    if request.method == "POST":
        request.user.set_password(request.POST['password'])
        request.user.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def enroll(request):
    if request.method == "POST":
        # first save the course to StudentCourseModel
        course = CourseModel.objects.get(pk=request.POST['course'])
        StudentCourseModel.objects.update_or_create(
            user=request.user,
            course=course,
            defaults={
                'user': request.user,
                'course': course
            })

        for c in request.POST.keys():
            if c not in ['csrfmiddlewaretoken', 'course']:
                StudentConstraintsModel.objects.update_or_create(
                    user=request.user,
                    constraint=c,
                    course=course,
                    defaults={
                        'user': request.user,
                        'constraint': Constraints.objects.get(pk=c),
                        'response': request.POST[c],
                        'course': course
                    })

        # after that redirect to the student home page
        return HttpResponseRedirect('/students/')

    constraints_db = Constraints.objects.all()
    student_selected_constraints = StudentConstraintsModel.objects.filter(
        user=request.user)
    constraints = []
    for c in constraints_db:
        t = {}
        t['id'] = c.id
        t['question'] = c.question
        t['options'] = ast.literal_eval(c.options)
        selected_db = StudentConstraintsModel.objects.filter(
            user=request.user, constraint=c.id)
        if selected_db.exists():
            selected_db = selected_db.first()
            t['selected'] = selected_db.response
        else:
            t['selected'] = ''
        constraints.append(t)

    course = CourseModel.objects.all()

    return render(request, 'studentconstraints.html', {
        'constraints': constraints,
        'course': course
    })


def return_member_name(group_id):
    name_obj = HomeworkGroupMember.objects.filter(
        group=HomeworkGroup.objects.get(
            group=group_id)).select_related('group')
    name = []
    for c in name_obj:
        name.append(c.user.name)
    return "\n".join(name)


def return_grade_explanation(group_id):
    grade = []
    explanation = []
    for c in HomeworkGroupGrade.objects.filter(group=group_id):
        grade.append(int(c.grade))
        explanation.append(c.explanation)

    if len(grade) > 0:
        return sum(grade) / len(grade), "\n".join(explanation)
    return "", ""


def get_grade_homework(group):
    grade = HomeworkGroupGrade.objects.filter(group=group).select_related(
        'group').order_by("group__homework__homework_name")

    grade_dic = []
    peer_grader = []
    for c in range(0, len(grade)):
        homework_name = grade[c].group.homework.homework_name
        has_appeal_done = grade[c].group.appeal_done_count
        appeal_done_status = grade[c].group.appeal_done_status
        appeal_reject_status = grade[c].group.appeal_reject_status
        temp = {}
        temp['type'] = 'grade'
        temp['homework_name'] = homework_name
        temp['grade'] = grade[c].grade
        temp['explanation'] = grade[c].explanation
        temp['group'] = grade[c].group.group
        temp['appeal_done_status'] = appeal_done_status
        temp['appeal_reject_status'] = appeal_reject_status
        temp['group_obj'] = grade[c].group
        grade_dic.append(temp)

        # check if the current grader has already been graded
        grading_done = PeerEvaluationModel.objects.filter(
            group=grade[c].group, peer_grader=grade[c].grader).exists()
        if not grading_done:
            peer = {}
            peer['group'] = grade[c].group.group
            peer['user'] = grade[c].grader
            peer['grade'] = grade[c].grade
            peer_grader.append(peer)

    return [grade_dic, peer_grader]


@login_required(login_url='/')
def student_course(request, course_id):
    constraints_db = Constraints.objects.all()

    student_course_enroll = StudentCourseModel.objects.filter(
        user=request.user)

    constraints = []
    users_group = []
    for c in constraints_db:
        t = {}
        t['id'] = c.id
        t['question'] = c.question
        t['options'] = ast.literal_eval(c.options)
        selected_db = StudentConstraintsModel.objects.filter(
            user=request.user, constraint=c.id)
        if selected_db.exists():
            selected_db = selected_db.first()
            t['selected'] = selected_db.response
        else:
            t['selected'] = ''
        constraints.append(t)

    course = CourseModel.objects.all()
    course_obj = CourseModel.objects.filter(pk=course_id).first()
    assignment = []
    # first fetch the group which user is part of
    homework_group_id = HomeworkGroupMember.objects.filter(
        user=request.user,
        group__course=course_obj).order_by("group__homework__homework_name")
    #
    for c in homework_group_id:
        group = c.group.group
        group_details = HomeworkGroup.objects.get(group=group)
        users_group.append(group_details.group)
        grade, explanation = return_grade_explanation(group)
        t = {}
        t['assignment_name'] = group_details.homework.homework_name
        t['members'] = return_member_name(group)
        t['deadline'] = group_details.homework.homework_deadline
        t['explanation'] = explanation
        t['grade'] = grade
        t['group_id'] = group_details.group
        t['group_obj'] = group_details
        t['uploads'] = group_details.attachment
        t['appeal_done_count'] = group_details.appeal_done_count
        t['total_member'] = group_details.total_member
        t['deadline_miss'] = group_details.deadline_miss
        if group_details.appeal_done_count == group_details.total_member:
            t['appeal_grade'] = group_details.grade
        else:
            t['appeal_grade'] = 0

        assignment.append(t)
    #
    peerevalutation = GroupCombinationModel.objects.filter(
        grader_user=request.user,
        active=True,
        group__course=course_obj,
        peerevalutation=False,
        group__attachment__isnull=False).order_by(
            "group__homework__homework_name")

    homework_group_id = HomeworkGroupMember.objects.filter(
        user=request.user,
        group__course=course_obj,
        group__attachment__isnull=True).order_by(
            "group__homework__homework_name")

    homework_appeal = HomeworkGroupMember.objects.filter(
        user=request.user,
        group__course=course_obj,
        group__appeal_done_status=False,
        group__appeal_reject_status=False,
        has_appealed=False).order_by(
            "group__homework__homework_name").select_related('group')

    grade = HomeworkGroupGrade.objects.filter(
        group__in=users_group).select_related('group').order_by(
            "group__homework__homework_name")

    grade_dic = []
    current = None
    for c in range(0, len(grade)):
        homework_name = grade[c].group.homework.homework_name
        has_appeal_done = grade[c].group.appeal_done_count
        appeal_done_status = grade[c].group.appeal_done_status
        appeal_reject_status = grade[c].group.appeal_reject_status

        if c == 0:
            current = homework_name
            change = False
        else:
            if current != homework_name:
                current = homework_name
                change = True
            else:
                change = False
        if change:
            if has_appeal_done == 0:
                appeal = {}
                appeal['type'] = 'appeal'
                appeal['group'] = grade_dic[c - 1]['group']
                appeal['appeal_done_status'] = grade_dic[c - 1][
                    'appeal_done_status']
                appeal['appeal_reject_status'] = grade_dic[c - 1][
                    'appeal_reject_status']
                grade_dic.append(appeal)

        temp = {}
        temp['type'] = 'grade'
        temp['homework_name'] = homework_name
        temp['grade'] = grade[c].grade
        temp['explanation'] = grade[c].explanation
        temp['group'] = grade[c].group.group
        temp['appeal_done_status'] = appeal_done_status
        temp['appeal_reject_status'] = appeal_reject_status
        grade_dic.append(temp)

        if c == len(grade) - 1:
            if has_appeal_done == 0:
                appeal = {}
                appeal['type'] = 'appeal'
                appeal['group'] = grade_dic[len(grade_dic) - 1]['group']
                appeal['appeal_done_status'] = grade_dic[len(grade_dic) - 1][
                    'appeal_done_status']
                appeal['appeal_reject_status'] = grade_dic[len(grade_dic) - 1][
                    'appeal_reject_status']
                grade_dic.append(appeal)

    appeal_grader_obj = AppealGraderModel.objects.filter(
        Q(appeal_grading_status=False)
        | Q(appeal_peer_grading_status=False),
        course=course_obj,
        appeal_grader=request.user.id).select_related('group')

    appeal_grader = []

    for c in appeal_grader_obj:
        result = get_grade_homework(c.group.group)
        temp = {}
        temp['grade'] = result[0]
        temp['homework'] = c.group.homework.homework_name
        temp['peer_grader'] = result[1]
        temp['is_grading_done'] = c.appeal_grading_status
        temp['is_peer_grading_done'] = c.appeal_peer_grading_status
        appeal_grader.append(temp)

    appeal_grade_result = AppealGraderModel.objects.filter(
        group__in=users_group).select_related('group').order_by(
            "group__homework__homework_name")

    return render(
        request, 'studentcourse.html', {
            'constraints': constraints,
            'course': course,
            'selected_course': course_id,
            'selected_course_obj': course_obj,
            'homework': assignment,
            'file_upload': homework_group_id.first(),
            'peerevalutation': peerevalutation,
            'grade': grade_dic,
            'homework_appeal': homework_appeal,
            'appeal_grader': appeal_grader,
            'student_course_enroll': student_course_enroll,
            'appeal_grade_result': appeal_grade_result
        })


def process_attachments(f, group_id):
    import os

    # creation of folder
    temp_dir = '/static/courses/' + str(group_id) + '/'
    dir_path = BASE_DIR + temp_dir

    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

    file_path = dir_path + f.name
    destination = open(file_path, 'wb+')
    for chunk in f.chunks():
        destination.write(chunk)
    destination.close()

    return temp_dir + f.name


@login_required(login_url='/')
def upload_assignment(request):
    for c in request.FILES:
        filepath = process_attachments(request.FILES[c], c)
        HomeworkGroup.objects.filter(pk=c).update(attachment=filepath)

        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def peervaluation(request, combination_id, group_id):
    # make combination_id peerevalutation value = false
    # and HomeworkGroupGrade table to be updated to corresponding
    # group_id
    grade = request.POST['grade']
    explanation = request.POST['explanation']
    group_obj = HomeworkGroup.objects.get(pk=group_id)

    # update the homework group grade table
    homework_grade_obj = HomeworkGroupGrade.objects.update_or_create(
        group=group_obj,
        grader=request.user,
        defaults={
            'explanation': explanation,
            'grade': grade
        })

    # find the average of the grade and save it
    total_grade = HomeworkGroupGrade.objects.filter(group=group_obj).aggregate(
        Avg('grade'))
    total_grade = int(round(total_grade['grade__avg']))
    group_obj.grade = total_grade
    group_obj.save()
    # update the current peerevaluation value = false so that grader can not reevaluate the same
    # combination again and again
    GroupCombinationModel.objects.filter(pk=combination_id).update(
        peerevalutation=True)

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def appeal(request, group):
    # here find out the person who can become grader
    # i.e first select the people who are part of the current group
    group_obj = HomeworkGroup.objects.get(group=group)

    user_not = []
    total_user = []
    user_in_current_group_dic = HomeworkGroupMember.objects.filter(
        group=group).values_list('user')

    grader_group_user_dic = GroupCombinationModel.objects.filter(
        group=group).values_list('grader_user__id')

    for c in user_in_current_group_dic:
        user_not.append(c[0])

    for c in grader_group_user_dic:
        user_not.append(c[0])

    total_user_in_course_dic = StudentCourseModel.objects.filter(
        course=group_obj.course, enrollment_status=True).values_list('user')

    for c in total_user_in_course_dic:
        total_user.append(c[0])

    # these are the remaining users that can become appeal_grader
    remaining_user = list(set(total_user) - set(user_not))

    if not len(remaining_user):
        return HttpResponse('Error Occureed', status=500)

    # now select 1 user who will become the appeal grader
    appeal_user = random.sample(remaining_user, 1)[0]

    # update the appeal_done_count status and make appeal_done_status=False
    if request.method == "POST":
        # here i can iterate the number of grader who will evaluate the appeal
        appeal_obj = AppealGraderModel()
        appeal_obj.group = group_obj
        appeal_obj.appeal_reason = request.POST['appeal_reason']
        appeal_obj.course = group_obj.course
        appeal_obj.appeal_grader = UserModel.objects.get(pk=appeal_user)
        appeal_obj.appeal_by_user = request.user
        appeal_obj.save()

    group_obj = HomeworkGroup.objects.get(group=group)
    group_obj.appeal_done_count = group_obj.appeal_done_count + 1
    group_obj.appeal_done_status = False
    group_obj.save()

    # now if the desired count has been met make the appeal visible to the appeal grader
    if group_obj.total_member == group_obj.appeal_done_count:
        AppealGraderModel.objects.filter(group=group_obj).update(
            appeal_visible_status=True)

    # update the group member table about the appeal has been done by the user
    HomeworkGroupMember.objects.filter(
        group=group, user=request.user).update(has_appealed=True)

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def submit_appeal_peer_grade(request, group):
    group_obj = HomeworkGroup.objects.get(group=group)

    course = group_obj.course
    homework = group_obj.homework

    peer_grading = {}

    if request.method == "POST":
        for c in request.POST.keys():
            if c != 'csrfmiddlewaretoken':
                split_current = c.split('__')
                user = split_current[1]
                column = split_current[0]
                if user not in peer_grading.keys():
                    peer_grading[user] = {}
                    peer_grading[user]['peer_grader'] = UserModel.objects.get(
                        pk=user)
                    peer_grading[user][column] = request.POST[c]
                    peer_grading[user]['group'] = group_obj
                    peer_grading[user]['course'] = course
                    peer_grading[user]['appeal_grader'] = request.user
                    peer_grading[user]['homework'] = homework
                else:
                    peer_grading[user][column] = request.POST[c]

        for c in peer_grading:
            PeerEvaluationModel.objects.update_or_create(
                group=group_obj,
                peer_grader=peer_grading[c]['peer_grader'],
                defaults=peer_grading[c])

    AppealGraderModel.objects.filter(
        group=group_obj,
        appeal_grader=request.user).update(appeal_peer_grading_status=True)

    # return HttpResponse('sad')
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def submit_appeal_grade(request, group):
    # i can make the homeworkgroup model calculate grade using the summation
    # of all appeal grader
    if request.method == "POST":
        group_obj = HomeworkGroup.objects.get(group=group)
        appeal_obj = AppealGraderModel.objects.filter(
            group=group_obj, appeal_grader=request.user).update(
                appeal_explanation=request.POST['appeal_explanation'],
                grade=request.POST['grade'],
                appeal_grading_status=True)

        total_grade = AppealGraderModel.objects.filter(
            group=group_obj).aggregate(Avg('grade'))

        total_grade = int(round(total_grade['grade__avg']))
        group_obj.grade = total_grade
        group_obj.save()

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def reject_appeal(request, group):
    homework_obj = HomeworkGroup.objects.filter(group=group).update(
        appeal_reject_status=True)
    return HttpResponse(group)