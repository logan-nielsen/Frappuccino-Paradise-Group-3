from django import views
from django.urls import re_path, path
from . import views

urlpatterns = [
  path("api/loghours/", views.add_shift, name="add_shift"),
  path("api/getshifts/", views.get_logged_shifts, name='get_logged_shifts'),
  path("api/employees/", views.employees, name='employees'),
  path("api/getunpaid/", views.get_unpaid, name="get_unpaid"),
  path("api/hire/", views.hire, name="hire"),
  path("api/fire/", views.fire, name='fire'),
  path("api/newuser/", views.new_account, name="new_account"),
  path("api/addcredit/", views.add_credit, name="add_credit"),
  path("api/account/", views.account, name="account"),
  re_path(r'.*', views.index, name='index'),
]
