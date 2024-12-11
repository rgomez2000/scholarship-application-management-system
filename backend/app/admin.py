from django.contrib import admin
from .models import *
# Register your models here.

class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'scholarship_name', 'amount', 'organization', 'department', 'open_date', 'deadline')

class ApplicantAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'first_name', 'last_name', 'scholarship', 'department', 'academic_level', 'enrollment_status','gpa')

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')

admin.site.register(Application)

admin.site.register(Scholarship, ScholarshipAdmin)
admin.site.register(Applicant, ApplicantAdmin)