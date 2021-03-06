# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from users.models import UserModel
from constraints.models import Constraints
from instructor.models import CourseModel
# Create your models here.
class StudentConstraintsModel(models.Model):
    user = models.ForeignKey(UserModel)
    constraint = models.ForeignKey(Constraints)
    response = models.TextField()
    course = models.ForeignKey(CourseModel)

    class Meta:
        db_table = 'student_constraint'


class StudentCourseModel(models.Model):
    user = models.ForeignKey(UserModel)
    course = models.ForeignKey(CourseModel)
    enrollment_status = models.BooleanField(default=True)

    class Meta:
        db_table = 'student_course_master'