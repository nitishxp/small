# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import ast

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from models import (StudentConstraintsModel, StudentCourseModel)
from constraints.models import Constraints
from instructor.models import (CourseModel, CourseHomeWorkModel, HomeworkGroup,
                               HomeworkGroupMember, GroupCombinationModel,
                               HomeworkGroupGrade)
from grade.settings import BASE_DIR
from django.db.models import Avg


# Create your views here.


def index(request):
    # check if user has not filled the survey form yes/no
    # constraints = StudentConstraintsModel.objects.filter(user=request.user)
    # if not constraints.exists():
    #     return HttpResponseRedirect('/students/constraints/')
    student_course = StudentCourseModel.objects.filter(user=request.user)

    return render(request, 'student.html', {'student_course': student_course})


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
        group=HomeworkGroup.objects.get(group=group_id))
    name = []
    for c in name_obj:
        name.append(c.user.name)
    return ",".join(name)


def return_grade_explanation(group_id):
    grade = []
    explanation = []
    for c in HomeworkGroupGrade.objects.filter(group=group_id):
        grade.append(int(c.grade))
        explanation.append(c.explanation)

    if len(grade) > 0:
        return sum(grade) / len(grade), " ".join(explanation)
    return "", ""


def student_course(request, course_id):
    constraints_db = Constraints.objects.all()

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
    course_obj = CourseModel.objects.filter(pk=course_id)
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
        group__course=course_obj, group__appeal_done_status=False, has_appealed=False).order_by(
        "group__homework__homework_name").select_related('group')

    grade = HomeworkGroupGrade.objects.filter(
        group__in=users_group).order_by("group__homework__homework_name")

    grade_dic = []
    current = None
    for c in range(0, len(grade)):
        homework_name = grade[c].group.homework.homework_name
        has_appeal_done = grade[c].group.appeal_done_count
        appeal_done_status = grade[c].group.appeal_done_status

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
                appeal['appeal_done_status'] = grade_dic[c - 1]['appeal_done_status']
                grade_dic.append(appeal)

        temp = {}
        temp['type'] = 'grade'
        temp['homework_name'] = homework_name
        temp['grade'] = grade[c].grade
        temp['explanation'] = grade[c].explanation
        temp['group'] = grade[c].group.group
        temp['appeal_done_status'] = appeal_done_status
        grade_dic.append(temp)

        if c == len(grade) - 1:
            if has_appeal_done == 0:
                appeal = {}
                appeal['type'] = 'appeal'
                appeal['group'] = grade_dic[len(grade_dic) - 1]['group']
                appeal['appeal_done_status'] = grade_dic[len(grade_dic) - 1]['appeal_done_status']
                grade_dic.append(appeal)

    return render(
        request, 'studentcourse.html', {
            'constraints': constraints,
            'course': course,
            'selected_course': course_id,
            'homework': assignment,
            'file_upload': homework_group_id.first(),
            'peerevalutation': peerevalutation,
            'grade': grade_dic,
            'homework_appeal': homework_appeal
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


def upload_assignment(request):
    for c in request.FILES:
        filepath = process_attachments(request.FILES[c], c)
        HomeworkGroup.objects.filter(pk=c).update(attachment=filepath)

        return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


def peervaluation(request, combination_id, group_id):
    # make combination_id peerevalutation value = false
    # and HomeworkGroupGrade table to be updated to corresponding
    # group_id
    grade = request.POST['grade']
    explanation = request.POST['explanation']

    # update the homework group grade table
    homework_grade_obj = HomeworkGroupGrade()
    homework_grade_obj.grade = grade
    homework_grade_obj.explanation = explanation
    homework_grade_obj.grader = request.user
    homework_grade_obj.group = HomeworkGroup.objects.get(pk=group_id)
    homework_grade_obj.save()

    # update the current peerevaluation value = false so that grader can not reevaluate the same
    # combination again and again
    GroupCombinationModel.objects.filter(pk=combination_id).update(
        peerevalutation=True)

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


def appeal(request, group):
    # update the appeal_done_count status and make appeal_done_status=False
    group_obj = HomeworkGroup.objects.get(group=group)
    group_obj.appeal_done_count = group_obj.appeal_done_count + 1
    group_obj.appeal_done_status = False
    group_obj.save()

    # update the group member table about the appeal has been done by the user
    HomeworkGroupMember.objects.filter(group=group, user=request.user).update(has_appealed=True)

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
