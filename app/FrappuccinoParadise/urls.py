from django import views
from django.urls import re_path, path
from . import views

urlpatterns = [
  re_path("api/loghours/", views.add_shift, name="add_shift"),
  re_path("api/getshifts/", views.get_logged_shifts, name='get_logged_shifts'),
  re_path("api/employees/", views.employees, name='employees'),
  re_path("api/getunpaid/", views.get_unpaid, name="get_unpaid"),
  re_path("api/hire/", views.hire, name="hire"),
  re_path("api/fire/", views.fire, name='fire'),
  re_path(r'^(?!api.*$).*', views.index, name='index'),
]
