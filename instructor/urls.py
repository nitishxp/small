from django.conf.urls import url, include
from views import *
urlpatterns = [
    url(r'^$', index, name="instructor__index"),
    url(r'course/$', course, name="instructor__course"),
    url(r'course/(?P<pk>[0-9]+)/homework/$',
        homework,
        name="instructor__homework"),
    url(r'course/(?P<pk>[0-9]+)/$',
        edit_course,
        name="instructor__edit_course"),
    url(r'do_grouping/(?P<pk>[0-9]+)/$',
        do_grouping,
        name="instructor__do_grouping"),
]
