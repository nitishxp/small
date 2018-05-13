# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-05-13 06:03
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Constraints',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(unique=True)),
                ('question', models.TextField()),
                ('input_type', models.TextField()),
                ('options', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
            options={
                'db_table': 'constraints',
            },
        ),
    ]
