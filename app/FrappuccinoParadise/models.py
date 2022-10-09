from django.db import models


# Create your models here.
class Drink(models.Model):
    name = models.CharField(max_length=50)
    cost = models.IntegerField()
    canMake = models.BooleanField(default=False)


class Ingredient(models.Model):
    drinks = models.ManyToManyField(Drink)
