# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import ast

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from models import StudentConstraintsModel, StudentCourseModel
from constraints.models import Constraints
from instructor.models import CourseModel, CourseHomeWorkModel, HomeworkGroup, HomeworkGroupMember

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
        group=HomeworkGroup.objects.get(
            group=group_id)).values_list('user__username')
    name = []
    for c in name_obj:
        name.append(c[0])

    return ",".join(name)


def student_course(request, course_id):

    constraints_db = Constraints.objects.all()
    student_selected_constraints = StudentConstraintsModel.objects.filter(
        user=request.user, course=course_id)

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
    course_obj = CourseModel.objects.filter(pk=course_id)
    assignment = []
    # first fetch the group which user is part of
    homework_group_id = HomeworkGroupMember.objects.filter(
        user=request.user, group__course=course_obj).order_by(
            "group__homework__homework_name").values_list('group')

    for c in homework_group_id:

        group_details = HomeworkGroup.objects.get(group=c[0])
        t = {}
        t['assignment_name'] = group_details.homework.homework_name
        t['members'] = return_member_name(c[0])
        t['deadline'] = group_details.homework.homework_deadline
        t['explanation'] = ""
        t['grade'] = ""
        assignment.append(t)

    return render(
        request, 'studentcourse.html', {
            'constraints': constraints,
            'course': course,
            'selected_course': course_id,
            'homework': assignment
        })
