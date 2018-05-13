# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import JSONField


# Create your models here.
class Constraints(models.Model):
    title = models.TextField(unique=True)
    question = models.TextField()
    input_type = models.TextField()
    options = models.TextField()
    class Meta:
        db_table = 'constraints'

