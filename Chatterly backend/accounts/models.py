from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db import models

# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True, )
    phone_number = models.CharField(max_length=20, unique=True, )
    email_verified = models.BooleanField(default=False, )
    phone_verified = models.BooleanField(default=False, )
    about = models.CharField(max_length=160, blank=True, )
    bio = models.TextField(blank=True, )
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class VerificationCode(models.Model):
    class Purpose(models.TextChoices):
        VERIFY_EMAIL = "verify_email", "Verify email"
        VERIFY_PHONE = "verify_phone", "Verify phone"
        PASSWORD_RESET = "password_reset", "Password reset"
        CHANGE_EMAIL = "change_email", "Change email"
        CHANGE_PHONE = "change_phone", "Change phone"

    class Channel(models.TextChoices):
        EMAIL = "email", "Email"
        SMS = "sms", "SMS"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="verification_codes",
    )

    purpose = models.CharField(
        max_length=30,
        choices=Purpose.choices,
    )
    channel = models.CharField(max_length=10, choices=Channel.choices, default="email",)
    
    destination = models.CharField(max_length=254)

    # Store a password style hash, never the raw code.
    code_hash = models.CharField(max_length=128)

    # Used when verifying a proposed new email or phone
    target_value = models.CharField(
        max_length=254,
        blank=True,
    )
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["purpose", "created_at"]),
        ]

    def __str__(self):
        return f"{self.purpose} for user {self.user_id}"

