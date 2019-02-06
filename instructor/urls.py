from django.conf.urls import url, include
from views import *

urlpatterns = [
    url(r'^$', course, name="instructor__index"),
    url(r'course/$', course, name="instructor__course"),
    url(r'course/(?P<pk>[0-9]+)/homework/$',
        homework,
        name="instructor__homework"),
    url(r'course/(?P<pk>[0-9]+)/$',
        edit_course,
        name="instructor__edit_course"),
    url(r'groupsame/(?P<pk>[0-9]+)/$',
        groupsame,
        name="instructor__group_same"),
    url(r'course/(?P<pk>[0-9]+)/enroll/$',
        change_enroll,
        name="instructor__change_enroll"),
    url(r'do_grouping/(?P<pk>[0-9]+)/$',
        do_grouping,
        name="instructor__do_grouping"),
    url(r're_grouping/(?P<pk>[0-9]+)/$',
        re_grouping,
        name="instructor__re_grouping"),
    url(r'student_upload/(?P<pk>[0-9]+)/$',
        student_upload,
        name="instructor__student_upload"),
    url(r'check_homework_deadline/$',
        check_homework_deadline,
        name="instructor__check_homework_deadline"),
    url(r'check_grading_deadline/$',
        check_grading_deadline,
        name="instructor__check_grading_deadline"),
    url(r'^change_password/$',
        change_password,
        name="instructor_change_password"),
    url(r'custom_grouping/(?P<pk>[0-9]+)/$',
        custom_grouping,
        name="instructor__custom_grouping"),
    url(r'course/(?P<pk>[0-9]+)/override/$',
        override_grade,
        name="instructor__override_grade"),
    url(r'course/(?P<pk>[0-9]+)/delete_student/$',
        delete_student,
        name="instructor__change_delete"),
    url(r'course/(?P<pk>[0-9]+)/download_all_homework/(?P<name>[0-9]+)/$',
        download_all_assignments_of_homework,
        name="instructor__download_all_assignments_of_homework"),
    url(r'course/(?P<pk>[0-9]+)/fetch_homework_group_members/(?P<name>[0-9]+)/$',
        fetch_homework_group_members,
        name="instructor__fetch_homework_group_members_of_homework"),
    url(r'course/(?P<pk>[0-9]+)/custom_grouping/$',
        custom_grouping_new,
        name="instructor__custom_grouping_new"),
    url(r'instructor__ta_assign/(?P<pk>[0-9]+)/$',
        ta_assign,
        name="instructor__ta_assign"),
]
