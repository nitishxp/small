# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import (
    HttpResponse,
    HttpResponseRedirect,
    JsonResponse,
)
from models import (
    CourseModel,
    CourseHomeWorkModel,
    HomeworkGroup,
    HomeworkGroupMember,
    GroupCombinationModel,
    HomeworkGroupGrade,
    AppealGraderModel,
    PeerEvaluationModel,
)
from constraints.models import Constraints
from grade.settings import BASE_DIR
from django.utils.datastructures import MultiValueDictKeyError
from students.models import (
    StudentCourseModel,
    StudentConstraintsModel,
)
import random
import collections
from users.models import UserModel
from itertools import permutations

from students.views import (
    return_member_name,
    return_grade_explanation,
    return_appeal_grade_explanation as return_appeal_grade_explanation_1,
)
from django.contrib.auth.decorators import login_required
from students.templatetags.filter import grade_alphabet
from django.utils import timezone
from django.db.models import Avg


@login_required(login_url='/')
def index(request):
    return render(request, 'instructor.html')


@login_required(login_url='/')
def change_password(request):
    if request.method == "POST":
        request.user.set_password(request.POST['password'])
        request.user.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


@login_required(login_url='/')
def course(request):
    if request.method == "POST":
        course_obj = CourseModel()
        course_obj.course_id = request.POST['course_id']
        course_obj.course_name = request.POST['course_name']
        course_obj.grading_rubric = request.POST['grading_rubric']
        course_obj.appeal_role = request.POST['appeal_role']
        course_obj.instructor = request.user
        course_obj.save()

        # after the course have been save now save the assignments
        assignments = {}
        for d in request.POST:
            data = request.POST[d]
            d = d.split("___")
            if len(d) > 1:
                if d[0] in assignments.keys():
                    assignments[d[0]][d[1]] = data
                else:
                    assignments[d[0]] = {}
                    assignments[d[0]]['homework_name'] = d[0]
                    assignments[d[0]][d[1]] = data

        for c in assignments:
            assignments[c]['course'] = course_obj
            CourseHomeWorkModel.objects.create(**assignments[c])

    course = CourseModel.objects.filter(instructor=request.user)

    return render(request, 'course.html', {'course': course})


@login_required(login_url='/')
def homework(request, pk):
    constraints = Constraints.objects.all()
    if request.method == "POST":
        print request.POST.getlist('constraints')
        homework_obj = CourseHomeWorkModel()
        homework_obj.homework_name = request.POST['homework_name']
        homework_obj.homework_deadline = request.POST['homework_deadline']
        homework_obj.grade_deadline = request.POST['grade_deadline']
        homework_obj.constraints = request.POST.getlist('constraints')
        homework_obj.course = CourseModel.objects.get(pk=pk)
        homework_obj.save()

        # process the attachments now
        file_path = process_attachments(request, pk, homework_obj.id)

        # Now update the filepath in db
        CourseHomeWorkModel.objects.filter(pk=homework_obj.id).update(
            attachment=file_path)

    homework = CourseHomeWorkModel.objects.all()

    return render(request, 'homework.html', {
        'constraints': constraints,
        'homework': homework
    })


@login_required(login_url='/')
def process_attachments(request, course_id, homework_id):
    import os
    try:
        f = request.FILES['attachment']
    except MultiValueDictKeyError:
        return None

    # creation of folder
    temp_dir = '/static/courses/' + str(course_id) + '/' + str(
        homework_id) + '/'
    dir_path = BASE_DIR + temp_dir

    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

    file_path = dir_path + f.name
    destination = open(file_path, 'wb+')
    for chunk in f.chunks():
        destination.write(chunk)
    destination.close()

    return temp_dir + f.name


def return_grade_explanation(group_id):
    grade = []
    explanation = []
    grader = []
    grader_user_id = []
    for c in GroupCombinationModel.objects.filter(
            group=group_id).select_related('grader_user'):
        grader.append(c.grader_user.name)
        grader_user_id.append(c.grader_user.id)

    grade = [''] * len(grader)
    explanation = [''] * len(grader)

    group_grade_obj = HomeworkGroupGrade.objects.filter(group=group_id)

    for c in group_grade_obj:
        index = grader_user_id.index(c.grader.id)
        grade[index] = grade_alphabet(c.grade)
        explanation[index] = c.explanation

    if len(grader) > 0:
        return "\n".join(grade), "\n".join(explanation), "\n".join(grader)

    return "", "", ""


def return_appeal_grade_explanation(group_id):
    grade = []
    explanation = []
    grader = []
    for c in AppealGraderModel.objects.filter(
            group=group_id).select_related('appeal_grader'):
        grade.append(grade_alphabet(c.grade))
        explanation.append(c.appeal_explanation)
        grader.append(c.appeal_grader.name)

    if len(grade) > 0:
        return "\n".join(grade), "\n".join(explanation), "\n".join(grader)
    return "", "", ""


@login_required(login_url='/')
def edit_course(request, pk):
    if request.method == "POST":

        course_obj = CourseModel.objects.filter(pk=pk).update(
            course_function = request.POST['course_function'],
            course_name=request.POST['course_name'],
            grading_rubric=request.POST['grading_rubric'],
            appeal_role=request.POST['appeal_role'],
            course_grading_type=request.POST['course_grading_type'],
            course_group_type=request.POST['course_group_type'])

        # after the course have been updated now save the assignments

        assignments = {}
        for d in request.POST:
            data = request.POST[d]
            d = d.split("___")
            if len(d) > 1:
                if d[0] in assignments.keys():
                    assignments[d[0]][d[1]] = data
                else:
                    assignments[d[0]] = {}
                    assignments[d[0]]['homework_name'] = d[0]
                    assignments[d[0]][d[1]] = data

        for c in assignments:
            CourseHomeWorkModel.objects.update_or_create(
                course=CourseModel.objects.get(pk=pk),
                homework_name=c,
                defaults=assignments[c])

        if request.POST['course_group_type'] == "same":
            do_same_grouping(pk)
        else:
            do_shuffle_grouping(pk)

    course = CourseModel.objects.filter(pk=pk).first()
    homework = CourseHomeWorkModel.objects.filter(
        course=pk).order_by('homework_name')
    enrolled_student = StudentCourseModel.objects.filter(
        course=pk).select_related('user')
    all_grades = {}
    group_grades = {}
    first_grader_grading = {}
    # first fill the dummy first_grader_grading with None value
    for u in enrolled_student:
        user_id_e = u.user.id
        user_obj_e = u.user
        if user_id_e not in first_grader_grading.keys():
            first_grader_grading[user_id_e] = {}
            first_grader_grading[user_id_e]['name'] = user_obj_e.name
            first_grader_grading[user_id_e]['grade'] = [None] * len(homework)

    for h in homework:
        homework_group = HomeworkGroup.objects.filter(
            course=course, homework=h)
        #
        for g in homework_group:
            if g.appeal_done_count == g.total_member:
                appeal_grade, appeal_explanation = return_appeal_grade_explanation_1(
                    g.group)
                grade = appeal_grade
            else:
                grade = g.grade

            # this is for the all_grades
            for members in HomeworkGroupMember.objects.filter(
                    group=g).select_related('user'):
                user_id = members.user.id
                users_obj = members.user
                if user_id not in all_grades.keys():
                    all_grades[user_id] = {}
                    all_grades[user_id]['name'] = users_obj.name
                    all_grades[user_id]['grade'] = []
                    all_grades[user_id]['grade'].append(grade)
                else:
                    all_grades[user_id]['grade'].append(grade)

            # this is for the first grader grading
            for grader_user in GroupCombinationModel.objects.filter(
                    group=g).select_related('grader_user'):
                grader_user_id = grader_user.grader_user.id
                grader_user_obj = grader_user.grader_user

                # first find in the appeal_group
                total_grade = PeerEvaluationModel.objects.filter(
                    group=g, peer_grader=grader_user_obj).aggregate(
                        Avg('grade'))

                if total_grade['grade__avg'] is not None:
                    total_grade = round(total_grade['grade__avg'])
                else:
                    # now check does this user have even done the grading
                    grading_done = HomeworkGroupGrade.objects.filter(
                        group=g, grader=grader_user_obj)
                    if grading_done.exists():
                        total_grade = grading_done.first()
                        total_grade = total_grade.grade
                    else:
                        total_grade = None

                first_grader_grading[grader_user_id]['grade'][
                    int(h.homework_name) - 1] = total_grade

        # first fetch the assignment name array
        group_grades[h.homework_name] = []
        for group in homework_group:
            grade_explanation = return_grade_explanation(group.group)
            appeal_grade_explanation = return_appeal_grade_explanation(
                group.group)
            temp = {}
            temp['group'] = return_member_name(group.group)
            temp['grader'] = grade_explanation[2]
            temp['grade'] = grade_explanation[0]
            temp['explanation'] = grade_explanation[1]
            temp['appeal_grader'] = appeal_grade_explanation[2]
            temp['appeal_grade'] = appeal_grade_explanation[0]
            temp['appeal_explanation'] = appeal_grade_explanation[1]
            temp['deadline_miss'] = group.deadline_miss
            temp['file'] = group.attachment

            group_grades[h.homework_name].append(temp)

    group_grades_sort = collections.OrderedDict(sorted(group_grades.items()))
    # now sum the all_grades
    for c in all_grades:
        t_all_grader = [x for x in all_grades[c]['grade'] if x is not None]
        if t_all_grader:
            sum_grade = sum(t_all_grader) / len(t_all_grader)
            all_grades[c]['grade'].append(sum_grade)
        else:
            all_grades[c]['grade'].append(None)

    # now sum the all first grading grades
    for c in first_grader_grading:
        t_all_grader = [
            x for x in first_grader_grading[c]['grade'] if x is not None
        ]
        if t_all_grader:
            sum_grade = sum(t_all_grader) / len(t_all_grader)
            first_grader_grading[c]['grade'].append(sum_grade)
        else:
            first_grader_grading[c]['grade'].append(None)

    print first_grader_grading

    return render(
        request, 'edit_course.html', {
            'course': course,
            'homework': homework,
            'enrolled_student': enrolled_student,
            'course_pk': pk,
            'all_grades': all_grades,
            'group_grades': group_grades_sort,
            'first_grader_grading': first_grader_grading
        })


def chunkIt(seq, num):
    avg = len(seq) / float(num)
    out = []
    last = 0.0

    while last < len(seq):
        out.append(seq[int(last):int(last + avg)])
        last += avg
    return out


def do_shuffle_grouping(pk):
    # first fetch the homework related to the course
    homework = CourseHomeWorkModel.objects.filter(course=pk)
    # constraints_student = {}
    # constraints = Constraints.objects.all()
    # for c in constraints:
    #     constraints_student[c.title] = []
    #     student = StudentConstraintsModel.objects.filter(course=pk,constraint=c.id)
    #     for s in student:
    #         constraints_student[c.title].append(s.user.id)
    # print constraints_student
    # second fetch the student who are part of the course
    enrolled_student = StudentCourseModel.objects.filter(
        course=pk, enrollment_status=True)
    course = CourseModel.objects.get(pk=pk)
    for c in homework:
        # check if this homework has already been started by the student
        # if yes then skip the current grouping
        homework_started = HomeworkGroup.objects.filter(
            homework=c, attachment__isnull=False)
        if homework_started.exists():
            continue
        group = []
        if c.constraints == "random":
            for d in enrolled_student:
                group.append(d.user.id)
            random.shuffle(group)
            # split the student in to random n groups
            # here i can ask emma to provide me the range of students
            # and how many group i want to have
            no_of_group = len(group) / c.no_of_group
            partition = chunkIt(group, no_of_group)
            t = [x for x in partition if x != []]
        groups_with_random_grader = {}
        print t
        # delete the previous group model if exists
        HomeworkGroup.objects.filter(homework=c, course=course).delete()
        for g in t:
            if len(g) > 0:
                import uuid
                group_id = uuid.uuid1().hex
                # create group id
                group_obj = HomeworkGroup.objects.create(
                    homework=c,
                    course=course,
                    group=group_id,
                    total_member=len(g))
                # now insert group member to the group
                temp_member_create = []
                for m in g:
                    temp_member_create.append(
                        HomeworkGroupMember(
                            user=UserModel.objects.get(pk=m), group=group_obj))
                HomeworkGroupMember.objects.bulk_create(temp_member_create)
                no_of_grader = c.no_of_grader
                if no_of_grader > len(g):
                    no_of_grader = len(g)
                groups_with_random_grader[group_id] = random.sample(
                    g, no_of_grader)
        print groups_with_random_grader
        # return JsonResponse(groups_with_random_grader, safe=False)
        # now its time to iterate the group with random grader
        # in order to make the group_id list so that
        # we can make a permutations to the group id
        temp_group = []
        for g in groups_with_random_grader:
            temp_group.append(g)
        temp_group_combination = []
        for i in range(len(temp_group)):
            pg = []
            pg.append((temp_group * 2)[i:i + 2][0])
            pg.append((temp_group * 2)[i:i + 2][1])
            for peer_grader in groups_with_random_grader[pg[1]]:
                temp_group_combination.append(
                    GroupCombinationModel(
                        homework=c,
                        course=course,
                        group=HomeworkGroup.objects.get(group=pg[0]),
                        grader_group=HomeworkGroup.objects.get(group=pg[1]),
                        grader_user=UserModel.objects.get(pk=peer_grader)))
        GroupCombinationModel.objects.bulk_create(temp_group_combination)
        # select a default entry for each group
        # ie if select A-B then delete B-A
        for g in groups_with_random_grader:
            # select A-B
            current_group = GroupCombinationModel.objects.filter(
                group=g).first()
            if current_group:
                # delete B-A
                current_group_grader_group = current_group.grader_group.group
                GroupCombinationModel.objects.filter(
                    group=current_group_grader_group, grader_group=g).delete()
                group = current_group.group.group
                grader_group = current_group.grader_group.group
                # now set all A-B active = True because of different grader
                GroupCombinationModel.objects.filter(
                    group=group, grader_group=grader_group).update(
                        active=True, is_used=True)
        GroupCombinationModel.objects.filter(active=False).delete()
    return True


def do_same_grouping(pk):
    
    homework = CourseHomeWorkModel.objects.filter(course=pk).order_by('homework_name')
    # # second fetch the student who are part of the course
    # enrolled_student = StudentCourseModel.objects.filter(
    #     course=pk, enrollment_status=True)
    course = CourseModel.objects.get(pk=pk)
    if not HomeworkGroup.objects.filter(course=course).exists():
        do_shuffle_grouping(pk)
        return 
    primary_group = None
    print "Group Exists Start Copying the group"
    for c in homework:
        homework_started = HomeworkGroup.objects.filter(homework=c, attachment__isnull=False)
        if homework_started.exists():
            continue
        if HomeworkGroup.objects.filter(course=course,homework=c).exists():
            primary_group = HomeworkGroupMember.objects.filter(group__course=course,group__homework=c)
            continue
        # check if there any group exists to replicate it or do reshuffling
        if primary_group is None:
            continue
        x = {}
        for pggg in primary_group:
            user = pggg.user.id
            group = pggg.group.group
            if group in x.keys():
                x[group].append(user)
            else:
                x[group] = []
                x[group].append(user)
        t = []
        for prv_group in x:
            t.append(x[prv_group])
        groups_with_random_grader = {}
        # delete the previous group model if exists
        HomeworkGroup.objects.filter(homework=c, course=course).delete()
        for g in t:
            if len(g) > 0:
                import uuid
                group_id = uuid.uuid1().hex
                # create group id
                group_obj = HomeworkGroup.objects.create(
                    homework=c,
                    course=course,
                    group=group_id,
                    total_member=len(g))
                # now insert group member to the group
                temp_member_create = []
                for m in g:
                    temp_member_create.append(
                        HomeworkGroupMember(
                            user=UserModel.objects.get(pk=m), group=group_obj))
                HomeworkGroupMember.objects.bulk_create(temp_member_create)
                no_of_grader = c.no_of_grader
                if no_of_grader > len(g):
                    no_of_grader = len(g)
                groups_with_random_grader[group_id] = random.sample(
                    g, no_of_grader)
        temp_group = []
        for g in groups_with_random_grader:
            temp_group.append(g)
        temp_group_combination = []
        print temp_group
        for i in range(len(temp_group)):
            pg = []
            pg.append((temp_group * 2)[i:i + 2][0])
            pg.append((temp_group * 2)[i:i + 2][1])
            for peer_grader in groups_with_random_grader[pg[1]]:
                temp_group_combination.append(
                    GroupCombinationModel(
                        homework=c,
                        course=course,
                        group=HomeworkGroup.objects.get(group=pg[0]),
                        grader_group=HomeworkGroup.objects.get(group=pg[1]),
                        grader_user=UserModel.objects.get(pk=peer_grader)))
        GroupCombinationModel.objects.bulk_create(temp_group_combination)
        # select a default entry for each group
        # ie if select A-B then delete B-A
        for g in groups_with_random_grader:
            # select A-B
            current_group = GroupCombinationModel.objects.filter(
                group=g).first()
            if current_group:
                # delete B-A
                current_group_grader_group = current_group.grader_group.group
                GroupCombinationModel.objects.filter(
                    group=current_group_grader_group, grader_group=g).delete()
                group = current_group.group.group
                grader_group = current_group.grader_group.group
                # now set all A-B active = True because of different grader
                GroupCombinationModel.objects.filter(
                    group=group, grader_group=grader_group).update(
                        active=True, is_used=True)
        GroupCombinationModel.objects.filter(active=False).delete()


def same_group(pk):
    homework = CourseHomeWorkModel.objects.filter(course=pk)
    


@login_required(login_url='/')
def student_upload(request, pk):
    import csv
    csv_file = request.FILES["student_upload"]
    file_data = csv_file.read().decode("utf-8").splitlines()
    lines = csv.DictReader(file_data)

    for line in lines:
        user = UserModel.objects.filter(username=line['SIS Login ID'])

        if not user.exists():
            user = UserModel.objects.create_user(
                username=line['SIS Login ID'], name=line['Student'])
            user.set_password(line['SIS Login ID'])
            user.save()

        course = CourseModel.objects.get(pk=pk)
        student_user = UserModel.objects.get(username=line['SIS Login ID'])

        StudentCourseModel.objects.update_or_create(
            user=student_user,
            course=course,
            defaults={
                'user': student_user,
                'course': course
            })

    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


def check_homework_deadline(request):
    from datetime import datetime, timedelta
    current_date = timezone.now()
    one_day_before_time = timezone.now() - timedelta(days=17)

    missed_deadline = HomeworkGroup.objects.filter(
        homework__homework_deadline__lt=current_date,
        homework__homework_deadline__gt=one_day_before_time,
        attachment__isnull=True)

    # now iterate the data and update the corresponding things
    # like update the Grade = 0 and make peer_evaluation_false

    for c in missed_deadline:
        c.grade = 0
        c.deadline_miss = True
        c.attachment = 'None'
        c.save()
        GroupCombinationModel.objects.filter(group=c.group).update(
            peerevalutation=True)

    return HttpResponse('Hello')


def check_grading_deadline(request):
    from datetime import datetime, timedelta
    current_date = timezone.now()
    one_day_before_time = timezone.now() - timedelta(days=17)

    missed_deadline = HomeworkGroup.objects.filter(
        homework__grade_deadline__lt=current_date,
        homework__homework_deadline__gt=one_day_before_time,attachment=True)

    print missed_deadline.query
    # now iterate the data and update the corresponding things
    # like update the Grade = 0 and make peer_evaluation_false

    for c in missed_deadline:
        first_grader = GroupCombinationModel.objects.filter(
            group=c.group, peerevalutation=False)

        for first in first_grader:
            if not HomeworkGroupGrade.objects.filter(
                    group=first.group, grader=first.grader_user).exists():
                peer_evalutation = {}
                peer_evalutation['group'] = first.group
                peer_evalutation['peer_grader'] = first.grader_user
                peer_evalutation['peer_explanation'] = "LATE GRADING"
                peer_evalutation['course'] = first.course
                peer_evalutation['grade'] = 0
                peer_evalutation['appeal_grader'] = first.course.instructor
                peer_evalutation['homework'] = first.homework
                PeerEvaluationModel.objects.create(**peer_evalutation)
                first.peerevalutation = True
                first.save()

    return HttpResponse('Hello')
