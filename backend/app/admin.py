from django.contrib import admin
from .models import Scholarship
from .models import Applicant

# Register your models here.

class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'scholarship_name', 'amount', 'organization', 'department', 'open_date', 'deadline')

class ApplicantAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'first_name', 'last_name', 'scholarship', 'department', 'academic_level', 'enrollment_status','gpa')

admin.site.register(Scholarship, ScholarshipAdmin)
admin.site.register(Applicant, ApplicantAdmin)