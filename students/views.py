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

    if request.method == "POST":
        data = request.POST
        for c in request.POST.keys():
            if c != 'csrfmiddlewaretoken':
                StudentConstraintsModel.objects.update_or_create(user=request.user,constraint=c,
                defaults={
                    'user':request.user,
                    'constraint':Constraints.objects.get(pk=c),
                    'response' : request.POST[c]
                })

    constraints_db = Constraints.objects.all()

    student_selected_constraints = StudentConstraintsModel.objects.filter(user=request.user)
    
    constraints = []
    
    for c in constraints_db:
        t = {}
        t['id'] = c.id
        t['question'] = c.question
        t['options'] = ast.literal_eval(c.options)
        selected_db = StudentConstraintsModel.objects.filter(user=request.user,constraint=c.id)
        if selected_db.exists():
            selected_db = selected_db.first()
            t['selected'] = selected_db.response
        else:
            t['selected'] = ''
        constraints.append(t)
        
    return render(request,'studentconstraints.html',{'constraints':constraints})

# def fill(request):
#     pass

#     constraints = Constraints.objects.all()