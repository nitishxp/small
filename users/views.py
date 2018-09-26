# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, reverse
from django.http import HttpResponse, HttpResponseRedirect
from users.models import UserModel
from django.contrib.auth import authenticate, login as auth_login


# Create your views here.
def signup(request):
    if request.method == "POST":
        print request.POST
        user = UserModel(
            username=request.POST['username'],
            name=request.POST.get('name'),
            role='instructor')
        user.set_password(request.POST['password'])
        user.save()
    return HttpResponseRedirect(reverse('instructor__course'))


def index(request):

    return render(request, 'index.html')


def login(request):

    # if request.user.is_authenticated:
    #     if request.user.role == "student":
    #         return HttpResponse('student')
    #     if request.user.role == "instructor":
    #         return HttpResponse('instructor')

    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            if user.role == "student":
                return HttpResponseRedirect(reverse('student__index'))
            if user.role == "instructor":
                return HttpResponseRedirect(reverse('instructor__course'))
            # Redirect to a success page.
        else:
            pass
            # Return an 'invalid login' error message.

    return render(request, 'registration/login.html')
