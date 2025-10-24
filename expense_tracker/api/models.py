from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    """
    Custom manager for User model.
    Handles user and superuser creation.
    """
    def create_user(self, email_address, password=None, **extra_fields):
        if not email_address:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email_address)
        user = self.model(email_address=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email_address, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email_address, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model using email as the unique identifier.
    """
    email_address = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email_address'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email_address

class Record(models.Model):
    """
    Stores a single expense or income record for a user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    record_type = models.CharField(max_length=100)  # e.g., 'expense' or 'income'
    category = models.CharField(max_length=50)
    note = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.TimeField()
    date = models.DateField()

    def __str__(self):
        return f'{self.record_type} - {self.category}'

class Budget(models.Model):
    """
    Stores a monthly budget for a user.
    """
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=20)
    year = models.CharField(max_length=4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)   

    def __str__(self):
        return f'{self.month}/{self.year} - {self.budget}'

