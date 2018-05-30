# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from models import CourseModel, CourseHomeWorkModel, HomeworkGroup, HomeworkGroupMember, GroupCombinationModel
from constraints.models import Constraints
from grade.settings import BASE_DIR
from django.utils.datastructures import MultiValueDictKeyError
from students.models import StudentCourseModel, StudentConstraintsModel
import random
from users.models import UserModel
from itertools import permutations


def index(request):

    return render(request, 'instructor.html')


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


def edit_course(request, pk):

    course = CourseModel.objects.filter(pk=pk).first()
    homework = CourseHomeWorkModel.objects.filter(course=pk)
    enrolled_student = StudentCourseModel.objects.filter(course=pk)
    return render(
        request, 'edit_course.html', {
            'course': course,
            'homework': homework,
            'enrolled_student': enrolled_student
        })


def chunkIt(seq, num):
    avg = len(seq) / float(num)
    out = []
    last = 0.0

    while last < len(seq):
        out.append(seq[int(last):int(last + avg)])
        last += avg
    return out


def do_grouping(request, pk):

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
        group = []
        if c.constraints == "random":
            for d in enrolled_student:
                group.append(d.user.id)
            random.shuffle(group)
            # split the student in to random n groups
            t = chunkIt(group, 3)

        # first delete the existing homework course relation
        HomeworkGroup.objects.filter(homework=c, course=course).delete()

        groups_with_random_grader = {}
        for g in t:
            if len(g) > 0:
                import uuid
                group_id = uuid.uuid1().hex
                # create group id
                group_obj = HomeworkGroup.objects.create(
                    homework=c, course=course, group=group_id)

                # now insert group member to the group
                for m in g:
                    member_obj = HomeworkGroupMember.objects.create(
                        user=UserModel.objects.get(pk=m), group=group_obj)

                random.shuffle(g)
                groups_with_random_grader[group_id] = g[0]

        # now its time to iterate the group with random grader
        temp_group = []
        for g in groups_with_random_grader:
            temp_group.append(g)

        GroupCombinationModel.objects.filter(
            homework=c, course=course).delete()

        for pg in permutations(temp_group, 2):
            user = groups_with_random_grader[pg[1]]
            GroupCombinationModel.objects.create(
                homework=c,
                course=course,
                group=HomeworkGroup.objects.get(group=pg[0]),
                grader_group=HomeworkGroup.objects.get(group=pg[1]),
                grader_user=UserModel.objects.get(pk=user))

        # select a default entry for each group
        for g in groups_with_random_grader:
            current_group = GroupCombinationModel.objects.filter(group=g).first()
            if current_group:
                current_group_grader_group = current_group.grader_group.group
                print current_group_grader_group,g
                GroupCombinationModel.objects.filter(group=current_group_grader_group,grader_group=g).delete()
                current_group.active = True
                current_group.save()

        print "##"  
