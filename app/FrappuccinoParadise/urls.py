from django import views
from django.urls import re_path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
  # other patterns here
  re_path('api/(.*)', views.api, name='api'),
  re_path(r'.*', TemplateView.as_view(template_name='index.html'))
]