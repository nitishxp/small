# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-09-25 17:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('instructor', '0049_coursemodel_course_group_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coursemodel',
            name='course_group_type',
            field=models.TextField(default='same'),
        ),
    ]
