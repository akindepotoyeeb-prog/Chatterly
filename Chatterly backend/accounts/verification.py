import secrets
import os
import requests
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.utils import timezone

from .models import VerificationCode


CODE_EXPIRY_MINUTES = 10
MAX_CODE_ATTEMPTS = 5


def create_verification_code(
    user,
    purpose,
    channel,
    destination,
    target_value="",
):
    """Create a hashed, single-use verification code."""

    now = timezone.now()

    # Invalidate earlier, unused codes for the same purpose and channel.
    VerificationCode.objects.filter(
        user=user,
        purpose=purpose,
        channel=channel,
        consumed_at__isnull=True,
    ).update(consumed_at=now)

    code = f"{secrets.randbelow(1_000_000):06d}"

    VerificationCode.objects.create(
        user=user,
        purpose=purpose,
        channel=channel,
        destination=destination,
        code_hash=make_password(code),
        target_value=target_value,
        expires_at=now + timedelta(minutes=CODE_EXPIRY_MINUTES),
    )

    return code


def verify_code(user, purpose, channel, code):
    """Validate a code and consume it once it succeeds."""

    verification = (
        VerificationCode.objects.filter(
            user=user,
            purpose=purpose,
            channel=channel,
            consumed_at__isnull=True,
        )
        .order_by("-created_at")
        .first()
    )

    if verification is None:
        return None, "No active verification code was found."

    now = timezone.now()

    if verification.expires_at <= now:
        verification.consumed_at = now
        verification.save(update_fields=["consumed_at"])
        return None, "The verification code has expired."

    if verification.attempts >= MAX_CODE_ATTEMPTS:
        verification.consumed_at = now
        verification.save(update_fields=["consumed_at"])
        return None, "Too many attempts. Request a new code."

    verification.attempts += 1

    if not check_password(code, verification.code_hash):
        if verification.attempts >= MAX_CODE_ATTEMPTS:
            verification.consumed_at = now

        verification.save(update_fields=["attempts", "consumed_at"])
        return None, "The verification code is invalid."

    verification.consumed_at = now
    verification.save(update_fields=["attempts", "consumed_at"])

    return verification, None


def deliver_verification_code(channel, destination, code, purpose):
    """
    Deliver a code by email or print it to the development console for SMS.

    Replace the SMS development branch with a real SMS provider before launch.
    """

    if channel == VerificationCode.Channel.EMAIL:
        sent = send_mail(
            subject="Your Chatterly verification code",
            message=(
                f"Your Chatterly code is {code}. "
                f"It expires in {CODE_EXPIRY_MINUTES} minutes. "
                "If you did not request this code, ignore this email."
            ),
            from_email=getattr(
                settings,
                "DEFAULT_FROM_EMAIL",
                None,
            ),
            recipient_list=[destination],
            fail_silently=False,
        )

        if not sent:
            raise RuntimeError("The verification email could not be sent.")

    elif channel == VerificationCode.Channel.SMS:
        api_key = os.getenv("TERMII_API_KEY")
        base_url = os.getenv("TERMII_BASE_URL", "https://api.ng.termii.com",).rstrip("/")
        sender_id = os.getenv("TERMII_SENDER_ID")

        if not api_key or not sender_id:
            raise RuntimeError(
                "Termii API key and sender ID must be configured."
            )
        response = requests.post(
            f"{base_url}/api/sms/send",
            json={
                "api_key": api_key,
                "to": destination,
                "from": sender_id,
                "sms": (
                    f"Your Chatterly verification code is {code}. "
                    f"It expires in {CODE_EXPIRY_MINUTES} minutes."
                ),
                "type": "plain",
                "channel": "generic",
            },
            timeout=20
        )

        response.raise_for_status()

