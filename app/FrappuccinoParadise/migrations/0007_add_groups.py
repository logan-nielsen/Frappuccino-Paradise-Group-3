# Generated by Django 4.0.2 on 2022-10-13 18:03

from django.db import migrations


def add_groups(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    # For adding permissions to these groups, see https://docs.djangoproject.com/en/4.1/topics/auth/default/#permissions-and-authorization
    customers = Group(name='Customers')
    customers.save()
    baristas = Group(name='Baristas')
    baristas.save()
    managers = Group(name='Managers')
    managers.save()


class Migration(migrations.Migration):

    dependencies = [
        ('FrappuccinoParadise', '0006_account'),
    ]

    operations = [
        migrations.RunPython(add_groups),
    ]