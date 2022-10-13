# Generated by Django 4.0.2 on 2022-10-13 18:36

from django.db import migrations


def add_users(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    User = apps.get_model('auth', 'User')
    Account = apps.get_model('FrappuccinoParadise', 'Account')

    managers = Group.objects.get(name='Managers')
    baristas = Group.objects.get(name='Baristas')
    customers = Group.objects.get(name='Customers')

    manager = User.objects.create_user('manager', 'manager@frappy.com', 'managerpassword')
    manager.groups.set([managers, baristas, customers])
    manager.save()
    managerAccount = Account(user=manager)
    managerAccount.save()

    barista1 = User.objects.create_user('barista1', 'barista1@frappy.com', 'barista1password')
    barista1.groups.set([baristas, customers])
    barista1.save()
    barista1Account = Account(user=barista1)
    barista1Account.save()

    barista2 = User.objects.create_user('barista2', 'barista2@frappy.com', 'barista2password')
    barista2.groups.set([baristas, customers])
    barista2.save()
    barista2Account = Account(user=barista2)
    barista2Account.save()

    customer1 = User.objects.create_user('customer1', 'customer1@frappy.com', 'customer1password')
    customer1.groups.set([customers])
    customer1.save()
    customer1Account = Account(user=customer1)
    customer1Account.save()

    customer2 = User.objects.create_user('customer2', 'customer2@frappy.com', 'customer2password')
    customer2.groups.set([customers])
    customer2.save()
    customer2Account = Account(user=customer2)
    customer2Account.save()


class Migration(migrations.Migration):

    dependencies = [
        ('FrappuccinoParadise', '0007_add_groups'),
    ]

    operations = [
        migrations.RunPython(add_users),
    ]