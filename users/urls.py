from django.conf.urls import url,include
from views import *
urlpatterns = [
    url(r'^$', login),
    url(r'signup/$', signup),
]

