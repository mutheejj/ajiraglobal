# Generated by Django 5.1.7 on 2025-03-24 07:48

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_user_currency_user_github_link_user_linkedin_link_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobpost',
            name='currency',
            field=models.CharField(choices=[('KSH', 'KSH'), ('USD', 'USD')], default='KSH', max_length=3),
        ),
        migrations.CreateModel(
            name='JobApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cover_letter', models.TextField(blank=True, null=True)),
                ('resume', models.FileField(blank=True, null=True, upload_to='applications/resumes/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])])),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('reviewing', 'Reviewing'), ('interviewed', 'Interviewed'), ('rejected', 'Rejected'), ('accepted', 'Accepted')], default='pending', max_length=20)),
                ('current_step', models.IntegerField(default=0)),
                ('steps', models.JSONField(default=list)),
                ('applied_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='accounts.jobpost')),
                ('job_seeker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-applied_date'],
                'unique_together': {('job_seeker', 'job')},
            },
        ),
    ]
