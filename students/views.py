# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import HttpResponse
from django.shortcuts import render
from models import StudentConstraintsModel
from constraints.models import Constraints
# Create your views here.

def index(request):
    # check if user has not filled the survey form yes/no
    student = StudentConstraintsModel.objects.filter(user=request.user)
    
    if not student.exists():
        return HttpResponse('no')
    return render(request,{})

def constraints(request):
    constraints = Constraints.objects.all()
    return render(request,'studentconstraints.html',{'constraints':constraints})