from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import EmailVerification
from .jobs import JobPost
from .job_applications import JobApplication

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'user_type', 'email_verified', 'date_joined', 'is_active', 'is_staff')
    list_filter = ('user_type', 'email_verified', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'username', 'company_name', 'profession')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'user_type', 'first_name', 'last_name')}),
        ('Client Information', {'fields': ('company_name', 'industry', 'company_size', 'website', 'description')}),
        ('Job Seeker Information', {'fields': ('profession', 'experience', 'skills', 'bio')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'email_verified', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'user_type', 'password1', 'password2'),
        }),
    )

@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'expires_at')
    search_fields = ('user__email', 'code')
    ordering = ('-created_at',)
    readonly_fields = ('code', 'created_at')

@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'client', 'category', 'experience_level', 'project_type', 'budget', 'status', 'created_at')
    list_filter = ('status', 'experience_level', 'project_type', 'remote_work', 'created_at')
    search_fields = ('title', 'client__email', 'client__company_name', 'category', 'skills')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    fieldsets = (
        ('Job Details', {'fields': ('client', 'title', 'category', 'description', 'requirements')}),
        ('Skills & Experience', {'fields': ('skills', 'experience_level')}),
        ('Project Information', {'fields': ('project_type', 'budget', 'duration', 'location', 'remote_work')}),
        ('Status', {'fields': ('status',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('job_seeker', 'job', 'status', 'current_step', 'applied_date')
    list_filter = ('status', 'applied_date')
    search_fields = ('job_seeker__email', 'job__title', 'job__client__company_name')
    readonly_fields = ('applied_date', 'last_updated')
    ordering = ('-applied_date',)
    fieldsets = (
        ('Application Details', {'fields': ('job_seeker', 'job', 'cover_letter', 'resume')}),
        ('Status Information', {'fields': ('status', 'current_step', 'steps')}),
        ('Timestamps', {'fields': ('applied_date', 'last_updated')}),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('job_seeker', 'job', 'job__client')