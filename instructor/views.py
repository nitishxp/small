# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from models import CourseModel, CourseHomeWorkModel
from constraints.models import Constraints
from grade.settings import BASE_DIR
from django.utils.datastructures import MultiValueDictKeyError


def index(request):

    return render(request, 'instructor.html')


def course(request):

    if request.method == "POST":
        course_obj = CourseModel()
        course_obj.course_id = request.POST['course_id']
        course_obj.course_name = request.POST['course_name']
        course_obj.no_of_student = request.POST['no_of_student']
        course_obj.instructor = request.user
        course_obj.save()

    course = CourseModel.objects.filter(instructor=request.user)

    return render(request, 'course.html', {'course': course})


def homework(request, pk):

    constraints = Constraints.objects.all()
    print request.POST

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
