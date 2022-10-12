from django.db import models
from djmoney.models.fields import MoneyField


# Create your models here.
class Ingredient(models.Model):
    name = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')
    amountPurchased = models.IntegerField(default=0)


class Drink(models.Model):
    name = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')
    ingredients = models.ManyToManyField(Ingredient)


class Order(models.Model):
    order = models.ManyToManyField(Drink)
    customerName = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')
    isActive = models.BooleanField(default=False)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
