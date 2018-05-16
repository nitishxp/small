# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import ast

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from models import StudentConstraintsModel
from constraints.models import Constraints
# Create your views here.

def index(request):
    # check if user has not filled the survey form yes/no
    constraints = StudentConstraintsModel.objects.filter(user=request.user)
    
    if not constraints.exists():
        return HttpResponseRedirect('/students/constraints/')
    return render(request,{})

def constraints(request):

    print request.POST
    constraints_db = Constraints.objects.all()
    constraints = []
    for c in constraints_db:
        t = {}
        t['id'] = c.id
        t['question'] = c.question
        t['options'] = ast.literal_eval(c.options)
        constraints.append(t)

    return render(request,'studentconstraints.html',{'constraints':constraints})

# def fill(request):
#     pass

#     constraints = Constraints.objects.all()