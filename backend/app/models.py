from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone

# Create your models here.

from django.db import models

class Scholarship(models.Model):
    RENEWAL_TYPES = [
        ("AR", "Automatic Renewal"),
        ("APR", "Application-Based Renewal"),
        ("MBS", "Merit-Based Renewal"),
        ("NBR", "Need-Based Renewal"),
        ("CR", "Conditional Renewal"),
        ("PR", "Partial Renewal"),
        ("NULL", "None"),
    ]

    scholarship_name = models.CharField(max_length=100, null=True, blank=False)
    open_date = models.DateField()
    deadline = models.DateField()
    renewal_type = models.CharField(max_length=32, choices=RENEWAL_TYPES, null=True, blank=False)
    amount = models.CharField(max_length=50, null=False, blank=False)
    organization = models.CharField(max_length=100, null=True, blank=False)
    department = models.CharField(max_length=100, null=True, blank=False)
    donor = models.CharField(max_length=100, null=True, blank=False)
    description = models.TextField(null=False, blank=False)
    additional_info = models.TextField(null=True, blank=False)
    
class Applicant(models.Model):
    ACADEMIC_LEVEL = [
        ("GRAD", "Graduate"),
        ("UNDER", "Undergradute"),
        ("HS", "High School"),
    ]
    ENROLL_STATUS = [
        ("FT", "Full Time"),
        ("PT", "Part Time"),
    ]
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE,null=True, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True, blank=False)
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField(unique=True, null=True, blank=False)
    first_name = models.CharField(max_length=32, null=True, blank=False)
    last_name = models.CharField(max_length=64, null=True, blank=False)
    birth_date = models.DateField(null=True, blank=False)
    address1 = models.CharField(max_length=256, null=True, blank=False)
    address2 = models.CharField(max_length=256, null=True, blank=False)
    gpa = models.DecimalField(max_digits = 3, decimal_places=2, null=True, blank=False)
    academic_level = models.CharField(max_length=32, choices=ACADEMIC_LEVEL, null=True, blank=False)
    enrollment_status = models.CharField(max_length=32, choices=ENROLL_STATUS, null=True, blank=False)
    SoP = models.FileField(upload_to='applicant_documents/', null=True, blank=False)
    department = models.CharField(max_length=128, null=True, blank=False)


class Application(models.Model):
    STATUS_TYPES = [
        ('submitted', 'Submitted'), 
        ('reviewed', 'Reviewed'), 
        ('approved', 'Approved'), 
        ('rejected', 'Rejected')
        ]
    
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE)
    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE)
    submitted_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPES)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    failed_login_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    
    # Track wheter user has changed their password after first login
    password_requires_change = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username