from functools import wraps
from django.http import HttpResponseRedirect
from models import (CourseModel, TA)
def instructor_ta_only(function):
  @wraps(function)
  def wrap(request, *args, **kwargs):
  	course = kwargs.get('pk')
  	print course,request.user
  	if CourseModel.objects.filter(instructor=request.user, pk=course).exists() or TA.objects.filter(user=request.user,course=course).exists():
  		return function(request, *args, **kwargs)
  	else:
  		return HttpResponseRedirect('/')
  return wrap