# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from models import *
from django.contrib import admin
admin.site.register([CourseModel, CourseHomeWorkModel,StudentCourseEnrolledModel,HomeworkGroup,HomeworkGroupMember,
                     HomeworkGroupGrade,GroupCombinationModel,AppealGraderModel,PeerEvaluationModel])

# Register your models here.
