from django.conf.urls import url, include
from views import *

urlpatterns = [
    url(r'^$', index, name="student__index"),
    url(r'^enroll/$', enroll, name="student__enroll"),
    url(r'^course/(?P<course_id>[0-9]+)/$', student_course, name="student__student_course"),
    url(r'^upload_assignment/$', upload_assignment, name="student__upload_assignment"),
    url(r'^peervaluation/(?P<combination_id>[0-9]+)/(?P<group_id>[0-9]+)/$', peervaluation,
        name="student__peervaluation"),

    url(r'^appeal/(?P<group>[0-9A-z]+)/$', appeal,
        name="student__appeal"),
]
