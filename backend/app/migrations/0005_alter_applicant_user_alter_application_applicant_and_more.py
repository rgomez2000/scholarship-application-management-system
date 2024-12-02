# Generated by Django 5.1.3 on 2024-12-02 03:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_remove_applicant_scholarships_applicant_scholarship_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='applicant',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='application',
            name='applicant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='app.applicant'),
        ),
        migrations.AlterField(
            model_name='application',
            name='scholarship',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='app.scholarship'),
        ),
    ]
