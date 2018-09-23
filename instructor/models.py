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
    course_grading_type = models.TextField(null=True)
    course_function = models.TextField(null=True)

    class Meta:
        db_table = 'course'


class CourseHomeWorkModel(models.Model):
    homework_name = models.TextField()
    grade_deadline = models.DateTimeField(null=True)
    homework_deadline = models.DateTimeField()
    no_of_group = models.IntegerField(null=True)
    no_of_grader = models.IntegerField(null=True)
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
    grade = models.DecimalField(null=True, decimal_places=2, max_digits=4)
    appeal_done_count = models.IntegerField(default=0)
    appeal_done_status = models.BooleanField(default=True)
    appeal_reject_status = models.BooleanField(default=False)
    deadline_miss = models.BooleanField(default=False)

    class Meta:
        db_table = 'homework_group_master'


class HomeworkGroupMember(models.Model):
    user = models.ForeignKey(UserModel)
    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)
    has_appealed = models.BooleanField(default=False)

    class Meta:
        db_table = 'homework_group_member'


class HomeworkGroupGrade(models.Model):
    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)
    grade = models.DecimalField(
        null=True, decimal_places=2, max_digits=4, default=0.00)
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
    grader_user = models.ForeignKey(UserModel)
    # appeal_grader = models.ForeignKey(UserModel, to_field='username')
    homework = models.ForeignKey(CourseHomeWorkModel)
    course = models.ForeignKey(CourseModel)
    active = models.BooleanField(default=False)
    peerevalutation = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'group_group_combination'


class AppealGraderModel(models.Model):
    class Meta:
        db_table = 'appeal_grader_master'

    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)

    appeal_grader = models.ForeignKey(
        UserModel, null=True, on_delete=models.CASCADE)
    appeal_explanation = models.TextField()
    appeal_reason = models.TextField()
    course = models.ForeignKey(CourseModel, on_delete=models.CASCADE)
    grade = models.DecimalField(null=True, decimal_places=2, max_digits=4)
    appeal_by_user = models.ForeignKey(
        UserModel, related_name='appeal_by_user', on_delete=models.CASCADE)
    appeal_visible_status = models.BooleanField(default=False)
    appeal_grading_status = models.BooleanField(default=False)
    appeal_peer_grading_status = models.BooleanField(default=False)


class PeerEvaluationModel(models.Model):
    class Meta:
        db_table = 'peer_evaluation'

    group = models.ForeignKey(
        HomeworkGroup, to_field='group', on_delete=models.CASCADE)
    peer_grader = models.ForeignKey(
        UserModel,
        null=True,
        on_delete=models.CASCADE,
        related_name='peer_grader')
    peer_explanation = models.TextField()
    course = models.ForeignKey(CourseModel, on_delete=models.CASCADE)
    grade = models.DecimalField(null=True, decimal_places=2, max_digits=4)
    appeal_grader = models.ForeignKey(
        UserModel, related_name='appeal_grader', on_delete=models.CASCADE)
    homework = models.ForeignKey(CourseHomeWorkModel)