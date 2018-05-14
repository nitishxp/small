# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from users.models import UserModel
from constraints.models import Constraints
# Create your models here.
class StudentConstraintsModel(models.Model):
    user = models.ForeignKey(UserModel)
    constraint = models.ForeignKey(Constraints)
    response = models.TextField()

    class Meta:
        db_table = 'student_constraint'


