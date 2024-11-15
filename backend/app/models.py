from django.db import models


# Create your models here.

from django.db import models

class Scholarship(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    deadline = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)

class Applicant(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

class Application(models.Model):
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    submitted_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('submitted', 'Submitted'), ('reviewed', 'Reviewed'), ('approved', 'Approved'), ('rejected', 'Rejected')])