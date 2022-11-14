from django import views
from django.urls import re_path, path
from . import views

urlpatterns = [
  path("api/getorders/", views.get_orders, name="get_orders"),
  path("api/placeorder/", views.place_order, name="place_order"),
  path("api/getmenu/", views.get_menu, name="get_menu"),
  path("api/getingredients/", views.get_ingredients, name="get_ingredients"),
  path("api/loghours/", views.add_shift, name="add_shift"),
  path("api/getshifts/", views.get_logged_shifts, name='get_logged_shifts'),
  path("api/employees/", views.employees, name='employees'),
  path("api/getcustomers/", views.get_customers, name='get_customers'),
  path("api/getunpaid/", views.get_unpaid, name="get_unpaid"),
  path("api/pay/", views.pay, name="pay"),
  path("api/hire/", views.hire, name="hire"),
  path("api/fire/", views.fire, name='fire'),
  path("api/newuser/", views.new_account, name="new_account"),
  path("api/addcredit/", views.add_credit, name="add_credit"),
  path("api/account/", views.account, name="account"),
  path("api/isemployee/", views.user_is_employee, name="user_is_employee"),
  path("api/ismanager/", views.user_is_manager, name="ismanager"),
  path("api/getrecipe/", views.get_recipe, name="get_recipe"),
  path("api/setorderready/", views.set_order_ready, name="set_order_ready"),
  path("api/setorderdelivered/", views.set_order_delivered, name="set_order_delivered"),
  path("api/buyingredients/", views.buy_ingredients, name="buy_ingredients"),
  path("api/addmenuitem/", views.add_menu_item, name="add_menu_item"),
  path("api/removemenuitem/", views.remove_menu_item, name="remove_menu_item"),
  path("api/editmenu/", views.edit_menu, name="edit_menu"),
  path("api/getmyorders/", views.get_my_orders, name="get_my_orders"),
  re_path(r'^(?!api.*$).*', views.index, name='index'),
]
