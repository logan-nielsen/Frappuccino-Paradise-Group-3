from django import views
from django.urls import re_path, path
from . import views

urlpatterns = [
  path("api/manageorder/", views.manage_order, name="manage_order"),
  path("api/getorders/", views.get_orders, name="get_orders"),
  path("api/placeorder/", views.place_order, name="place_order"),
  path("api/getmenu/", views.get_menu, name="get_menu"),
  path("api/getingredients/", views.get_ingredients, name="get_ingredients"),
  path("api/loghours/", views.add_shift, name="add_shift"),
  path("api/getshifts/", views.get_logged_shifts, name='get_logged_shifts'),
  path("api/employees/", views.employees, name='employees'),
  path("api/getunpaid/", views.get_unpaid, name="get_unpaid"),
  path("api/hire/", views.hire, name="hire"),
  path("api/fire/", views.fire, name='fire'),
  path("api/newuser/", views.new_account, name="new_account"),
  path("api/addcredit/", views.add_credit, name="add_credit"),
  path("api/account/", views.account, name="account"),
  path("api/isemployee/", views.user_is_employee, name="user_is_employee"),
  path("api/ismanager/", views.is_employee, name="ismanager"),
  path("api/getrecipe/", views.get_recipe, name="get_recipe"),
  re_path(r'^(?!api.*$).*', views.index, name='index'),
]
