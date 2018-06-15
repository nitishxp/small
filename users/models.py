# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser

# Create your models here.

class UserModel(AbstractUser):

    role = models.TextField(null=True,default='student')
    name = models.TextField(null=True)
    class Meta:
        db_table = 'users'