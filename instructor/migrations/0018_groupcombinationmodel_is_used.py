# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-06-21 10:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('instructor', '0017_auto_20180621_0722'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupcombinationmodel',
            name='is_used',
            field=models.BooleanField(default=False),
        ),
    ]