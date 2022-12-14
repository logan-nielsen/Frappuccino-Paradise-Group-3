# Generated by Django 4.0.2 on 2022-10-19 03:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('FrappuccinoParadise', '0008_add_users'),
    ]

    operations = [
        migrations.CreateModel(
            name='TimeCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('hours', models.FloatField()),
                ('paid', models.BooleanField(default=False)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FrappuccinoParadise.account')),
            ],
        ),
    ]
