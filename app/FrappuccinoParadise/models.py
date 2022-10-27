from django.db import models
from django.contrib.auth.models import User
from djmoney.models.fields import MoneyField


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    credit = MoneyField(default=0, max_digits=6, decimal_places=2, default_currency='USD')

    def getUnpaidHours(self):
        unpaid = self.timecard_set.filter(paid=False)
        return sum([shift.hours for shift in unpaid])


class TimeCard(models.Model):
    employee = models.ForeignKey(Account, on_delete=models.CASCADE)
    date = models.DateField()
    hours = models.FloatField()
    paid = models.BooleanField(default=False)


class Ingredient(models.Model):
    name = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')
    amountPurchased = models.IntegerField(default=0)


class Drink(models.Model):
    name = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')


class IngredientItem(models.Model):
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    number = models.IntegerField(default=1)


class Order(models.Model):
    customerName = models.CharField(default='', max_length=50)
    cost = MoneyField(default=0, max_digits=5, decimal_places=2, default_currency='USD')
    isReady = models.BooleanField(default=False)
    isDelivered = models.BooleanField(default=False)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    drink = models.ForeignKey(Drink, on_delete=models.CASCADE)
    number = models.IntegerField(default=1)


class AddOn(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    number = models.IntegerField(default=1)
    orderItem = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
