# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from users.models import UserModel

# Create your models here.


class CourseModel(models.Model):
    course_id = models.TextField()
    course_name = models.TextField()
    grading_rubric = models.TextField(null=True)
    appeal_role = models.TextField(null=True)
    instructor = models.ForeignKey(UserModel)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'course'


class CourseHomeWorkModel(models.Model):
    homework_name = models.TextField()
    grade_deadline = models.DateField()
    homework_deadline = models.DateField()

    # will save constraints in array form
    constraints = models.TextField()
    course = models.ForeignKey(CourseModel)
    attachment = models.TextField(null=True)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'course_homework'


class StudentCourseEnrolledModel(models.Model):
    course = models.ForeignKey(CourseModel)
    student = models.TextField()

    class Meta:
        db_table = 'course_student'


class HomeworkGroup(models.Model):
    homework = models.ForeignKey(CourseHomeWorkModel)
    course = models.ForeignKey(CourseModel)
    group = models.TextField(unique=True)
    attachment = models.TextField(null=True)
    total_member = models.IntegerField(default=0)
    appeal_done_count = models.IntegerField(default=0)

    class Meta:
        db_table = 'homework_group_master'


class HomeworkGroupMember(models.Model):
    user = models.ForeignKey(UserModel)
    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)

    class Meta:
        db_table = 'homework_group_member'


class HomeworkGroupGrade(models.Model):

    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)
    grade = models.TextField(default=0)
    explanation = models.TextField(null=True)
    grader = models.ForeignKey(UserModel)

    class Meta:
        db_table = 'homework_group_grade'


class GroupCombinationModel(models.Model):

    group = models.ForeignKey(
        HomeworkGroup,
        to_field='group',
        on_delete=models.CASCADE,
        related_name='group1')
    grader_group = models.ForeignKey(
        HomeworkGroup,
        to_field='group',
        on_delete=models.CASCADE,
        related_name='group2')
    grader_user = models.ForeignKey(UserModel, to_field='username')
    homework = models.ForeignKey(CourseHomeWorkModel)
    course = models.ForeignKey(CourseModel)
    active = models.BooleanField(default=False)
    peerevalutation = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'group_group_combination'