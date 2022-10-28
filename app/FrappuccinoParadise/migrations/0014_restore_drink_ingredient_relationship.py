# Generated by Django 4.0.2 on 2022-10-26 00:06

from django.db import migrations

from FrappuccinoParadise.models import Drink, Ingredient

def restore_drink_ingredient_relationship(apps, schema_editor):
    # Get ingredients
    coffee_beans = Ingredient.objects.get(name="Coffee Beans")
    milk = Ingredient.objects.get(name="Milk")
    cinnamon = Ingredient.objects.get(name="Cinnamon")
    ice_cream = Ingredient.objects.get(name="Ice Cream")
    egg = Ingredient.objects.get(name="Egg")
    sugar = Ingredient.objects.get(name="Sugar")
    creamer = Ingredient.objects.get(name="Creamer")
    matcha = Ingredient.objects.get(name="Matcha")
    vanilla = Ingredient.objects.get(name="Vanilla")
    honey = Ingredient.objects.get(name="Honey")

    # Get drinks
    black_coffee = Drink.objects.get(name="Black Coffee")
    espresso = Drink.objects.get(name="Espresso")
    egg_coffee = Drink.objects.get(name="Egg Coffee")
    coffee_float = Drink.objects.get(name="Coffee Float")
    matcha_coffee = Drink.objects.get(name="Matcha Coffee")
    sugar_and_honey = Drink.objects.get(name="Sugar and Honey")

    # Set up relationships
    black_coffee.ingredientitem_set.create(ingredient=coffee_beans)
    
    espresso.ingredientitem_set.create(ingredient=coffee_beans)
    espresso.ingredientitem_set.create(ingredient=milk)
    
    egg_coffee.ingredientitem_set.create(ingredient=coffee_beans)
    egg_coffee.ingredientitem_set.create(ingredient=milk)
    egg_coffee.ingredientitem_set.create(ingredient=egg)
    
    coffee_float.ingredientitem_set.create(ingredient=coffee_beans)
    coffee_float.ingredientitem_set.create(ingredient=ice_cream)
    
    matcha_coffee.ingredientitem_set.create(ingredient=coffee_beans)
    matcha_coffee.ingredientitem_set.create(ingredient=matcha)
    
    sugar_and_honey.ingredientitem_set.create(ingredient=coffee_beans)
    sugar_and_honey.ingredientitem_set.create(ingredient=sugar)
    sugar_and_honey.ingredientitem_set.create(ingredient=honey)

    black_coffee.save()
    espresso.save()
    egg_coffee.save()
    coffee_float.save()
    matcha_coffee.save()
    sugar_and_honey.save()


class Migration(migrations.Migration):

    dependencies = [
        ('FrappuccinoParadise', '0013_remove_drink_ingredients_remove_order_order_and_more'),
    ]

    operations = [
        migrations.RunPython(restore_drink_ingredient_relationship),
    ]