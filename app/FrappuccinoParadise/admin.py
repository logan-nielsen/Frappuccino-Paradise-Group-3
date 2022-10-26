from django.contrib import admin

from .models import *

admin.site.register(Ingredient)
admin.site.register(Drink)
admin.site.register(Order)
admin.site.register(TimeCard)
admin.site.register(IngredientItem)
admin.site.register(OrderItem)
