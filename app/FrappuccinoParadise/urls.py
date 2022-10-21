from django import views
from django.urls import re_path, path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
  # other patterns here
  re_path('api/test', views.api, name='api'),
  re_path(r'.*', TemplateView.as_view(template_name='FrappuccinoParadise/index.html')),
  path("loghours/", views.add_shift, "add_shift"),
]
