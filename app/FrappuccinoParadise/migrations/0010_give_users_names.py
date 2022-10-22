# Generated by Django 4.0.2 on 2022-10-22 16:45

from django.db import migrations


def add_names(apps, schema_editor):
    User = apps.get_model('auth', 'User')

    manager = User.objects.get(username='manager')
    manager.first_name = "The"
    manager.last_name = "Manager"
    manager.save()

    barista1 = User.objects.get(username='barista1')
    barista1.first_name = "Barista"
    barista1.last_name = "One"
    barista1.save()

    barista2 = User.objects.get(username='barista2')
    barista2.first_name = "Barista"
    barista2.last_name = "Two"
    barista2.save()

    customer1 = User.objects.get(username='customer1')
    customer1.first_name = "Customer"
    customer1.last_name = "One"
    customer1.save()

    customer2 = User.objects.get(username='customer2')
    customer2.first_name = "Customer"
    customer2.last_name = "Two"
    customer2.save()

class Migration(migrations.Migration):

    dependencies = [
        ('FrappuccinoParadise', '0009_timecard'),
    ]

    operations = [
        migrations.RunPython(add_names)
    ]
