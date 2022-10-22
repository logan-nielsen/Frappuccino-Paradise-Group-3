from django import views
from django.urls import re_path, path
from django.views.generic import TemplateView
from . import views

urlpatterns = [
  # other patterns here
  re_path('api/test', views.api, name='api'),
  re_path(r'.*', views.index, name='index'),
  path("api/loghours/", views.add_shift, name="add_shift"),
  path("api/getshifts/", views.get_logged_shifts, name='get_logged_shifts'),
  path("api/employees/", views.employees, 'employees'),
  path("api/getunpaid/", views.get_unpaid, name="get_unpaid"),
  path("api/hire/", views.hire, name="hire"),
]
