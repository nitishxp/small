from django.conf.urls import url, include
from views import *
urlpatterns = [
    url(r'^$', index, name="student__index"),
    url(r'^constraints/$', constraints, name="student__constraints"),
]
