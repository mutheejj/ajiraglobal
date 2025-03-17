# Generated by Django 5.1.7 on 2025-03-17 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='user_type',
            field=models.CharField(choices=[('client', 'Client'), ('job-seeker', 'Job Seeker')], max_length=20, null=True),
        ),
    ]
