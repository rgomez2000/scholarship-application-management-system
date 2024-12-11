from django.db import models
from django.contrib.auth.models import User
from phonenumber_field.modelfields import PhoneNumberField
from django.utils import timezone
from decimal import Decimal, InvalidOperation

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
    date_created = models.DateTimeField(auto_now_add=True)
    renewal_type = models.CharField(max_length=32, choices=RENEWAL_TYPES, null=True, blank=False)
    amount = models.CharField(max_length=50, null=False, blank=False)
    organization = models.CharField(max_length=100, null=True, blank=False)
    department = models.CharField(max_length=100, null=True, blank=True)
    donor = models.CharField(max_length=100, null=True, blank=False)
    description = models.TextField(null=False, blank=False)
    additional_info = models.TextField(null=True, blank=False)

    @staticmethod
    def convert_to_decimal(value):
        try:
            # Remove non-numeric characters like '$' and commas
            cleaned_value = value.replace('$', '').replace(',', '').strip()
            return Decimal(cleaned_value)
        except (InvalidOperation, ValueError):
            return "Varies"  # Set invalid values to 0 instead of None
        
    def save(self, *args, **kwargs):
        if isinstance(self.amount, str):  # Convert string amounts to Decimal if applicable
            self.amount = self.convert_to_decimal(self.amount)
        super().save(*args, **kwargs)

    
    
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
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True, blank=False)
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
    
    scholarship = models.ForeignKey(Scholarship, related_name="applications", on_delete=models.CASCADE)
    applicant = models.ForeignKey(Applicant,  related_name="applications", on_delete=models.CASCADE)
    submitted_on = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_TYPES)

    def save(self, *args, **kwargs):
            if self.pk:  # Only check if the object already exists
                original = Application.objects.get(pk=self.pk)
                if original.status != self.status:
                    Notification.objects.create(
                        user=self.applicant.user, 
                        message=f"Your application for {self.scholarship.scholarship_name} is now {self.status}.",
                    )
            super().save(*args, **kwargs)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    failed_login_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    
    # Track wheter user has changed their password after first login
    password_requires_change = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message[:50]}"