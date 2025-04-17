from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={'unique': 'A user with that username already exists.'},
        help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
    )
    email = models.EmailField(max_length=254, unique=True, verbose_name='email address')
    first_name = models.CharField(max_length=150, blank=True, verbose_name='first name')
    last_name = models.CharField(max_length=150, blank=True, verbose_name='last name')
    resume_data = models.JSONField(null=True, blank=True, help_text="Store list of resume data in JSON format.")
    phone_number = models.CharField(max_length=15, null=True, blank=True, help_text="Enter your phone number.")
    
    # Standard fields
    is_active = models.BooleanField(default=True, help_text='Designates whether this user should be treated as active.')
    is_staff = models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.')
    is_superuser = models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.')
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='date joined')

    # Required permissions
    groups = models.ManyToManyField('auth.Group', blank=True, related_name='user_set', related_query_name='user', verbose_name='groups')
    user_permissions = models.ManyToManyField('auth.Permission', blank=True, related_name='user_set', related_query_name='user', verbose_name='user permissions')

    # Manager
    objects = CustomUserManager()

    # Password and authentication
    USERNAME_FIELD = 'email'  # Use email as the primary identifier
    REQUIRED_FIELDS = ['username', 'company_name']  # Add company_name to required fields for superuser creation

    def save(self, *args, **kwargs):
        # Automatically set the username by extracting the part before '@' in the email
        if not self.username:
            self.username = self.email.split('@')[0]
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        abstract = False

    def __str__(self):
        return self.username
