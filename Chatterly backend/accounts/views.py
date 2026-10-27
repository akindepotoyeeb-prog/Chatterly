import logging
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import (
    RegisterSerializer, 
    ChangeEmailSerializer, 
    ChangePhoneSerializer, 
    ContactChangeConfirmSerializer, 
    ChangePasswordSerializer, 
    PasswordResetConfirmSerializer, 
    PasswordResetRequestSerializer,
)

# phase2
from django.contrib.auth import authenticate, get_user_model, login, logout, update_session_auth_hash
from django.db.models import Q
from rest_framework.views import APIView

from .models import VerificationCode
from .verification import (
    create_verification_code,
    deliver_verification_code,
    verify_code,
)

# New
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes

logger = logging.getLogger(__name__)

User = get_user_model()

# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exeption=True)

        user = serializer.save()

        return Response(
            {
                "message": ("Account created succssfully. ",
                            "Email and phone verification are still required."),
                "user": {
                    "id": user.pk,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "phone_number": user.phone_number,
                    "email_verified": user.email_verified,
                    "phone_verified": user.phone_verified,

                },
            },
            status=status.HTTP_201_CREATED,
        )

class VerificationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        channel = request.data.get("channel", "").lower()

        if channel == "email":
            destination = request.user.email
            purpose = VerificationCode.Purpose.VERIFY_EMAIL
        elif channel == "sms":
            destination = request.user.phone_number
            purpose = VerificationCode.Purpose.VERIFY_PHONE
        else:
            return Response(
                {"error": "Channel must be Email or SMS. "},

                status=status.HTTP_400_BAD_REQUEST,
            )
        code = create_verification_code(
            user=request.user,
            purpose=purpose,
            channel=channel,
            destination=destination,
        )

        try:
            deliver_verification_code(
                channel, destination, code, purpose
            )

        except Exception:
            # Avoid returning internal delivery details to clients.
            return Response(
                {"error": "Could not deliver the verification code. "},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({
            "message": "If delivery is configured, a verification code has been sent"
        })

class VerifyContactView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        channel = request.data.get("channel", "").lower()
        code = str(request.data.get("code", "")).strip()

        if channel == "email":
            purpose = VerificationCode.Purpose.VERIFY_EMAIL
        elif channel == "sms":
            purpose = VerificationCode.Purpose.VERIFY_PHONE
        else:
            return Response(
                {"error": "Channel must be Email or SMS. "},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(code) != 6 or not code.isdigit():
            return Response(
                {"error": "Enter the six-digit verification code. "},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verification, error = verify_code(
            request.user, purpose, channel, code
        )

        if error:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if channel == "email":
            request.user.email_verified = True
            request.user.save(update_fields=["email_verified"])
        else:
            request.user.phone_verified = True
            request.user.save(update_fields=["phone_verified"])

        return Response({"message": "Contact verified successfully."})

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = str(request.data.get("identifier", "")).strip()
        password = request.data.get("password", "")

        if not identifier or not password:
            return Response(
                {"error": "Identifier and password are required. "},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(
            Q(email__iexact=identifier) | Q(phone_number=identifier)
        ).first()

        authenticated_user = None

        if user:
            authenticated_user = authenticate(
                request,
                username=user.username,
                password=password,
            )

        if authenticated_user is None:
            return Response(
                {"error": "Invalid login details."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not (
            authenticated_user.email_verified and authenticated_user.phone_verified
        ):
            return Response(
                {"error": "Verify both your email and phone before logging in. "},
                status=status.HTTP_403_FORBIDDEN,
            )
        login(request, authenticated_user)
        return Response({
             "message": "Login successful.",
             "user": {
                 "id": authenticated_user.pk,
                 "first_name": authenticated_user.first_name,
                 "last_name": authenticated_user.last_name,
                 "username": authenticated_user.username,
                 "email": authenticated_user.email,
                 "phone_number": authenticated_user.phone_number,
                 "email_verified": authenticated_user.email_verified,
                 "phone_verified": authenticated_user.phone_verified,
                 
             },
        })
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({
            "message": "Logout successful. "
        })

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.pk,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number,
            "email_verified": user.email_verified,
            "phone_verified": user.phone_verified,
            "about": user.about,
            "bio": user.bio,
            "profile_picture": (
                request.build_absolute_uri(user.profile_picture.url)
                if user.profile_picture else None
            ),
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        })
        

@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token_view(request):
    return Response({
        "csrfToken": get_token(request)
    })



class ChangeEmailRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_email = serializer.validated_data["new_email"]

        code = create_verification_code(
            user=request.user,
            purpose=VerificationCode.Purpose.CHANGE_EMAIL,
            channel=VerificationCode.Channel.EMAIL,
            destination=new_email,
            target_value=new_email,
        )

        try:
            deliver_verification_code(
                channel=VerificationCode.Channel.EMAIL,
                destination=new_email,
                code=code,
                purpose=VerificationCode.Purpose.CHANGE_EMAIL,
            )
        except Exception:
            logger.exception("Failed to send email_change verification code. ")
            VerificationCode.objects.filter(
                user=request.user,
                purpose=VerificationCode.Purpose.CHANGE_EMAIL,
                channel=VerificationCode.Channel.EMAIL,
                target_value=new_email,
                consumed_at__isnull=True,
            ).update(consumed_at=timezone.now())

            return Response(
                {"detail": "Could not sent the verification code. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({
            "detail": "A verification code has been sent to your new email address."
        })


class ChangePhoneRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_phone = serializer.validated_data["new_phone_number"]

        code = create_verification_code(
            user=request.user,
            purpose = VerificationCode.Purpose.CHANGE_PHONE,
            channel = VerificationCode.Chennel.SMS,
            destination = new_phone,
            target_value = new_phone,
        )

        try:
            deliver_verification_code(
                channel=VerificationCode.Channel.SMS,
                purpose=VerificationCode.Purpose.CHANGE_PHONE,
                destination=new_phone,
                code=code,
            )
        except Exception:
            logger.exception("Failed to send phone-change verification code. ")
            VerificationCode.objects.filter(
                user=request.user,
                purpose=VerificationCode.Purpose.CHANGE_PHONE,
                channel = VerificationCode.Channel.SMS,
                target_value=new_phone,
                consumed_at__isnull=True,
            ).update(consumed_at=timezone.now())

            return Response(
                {"detail": "Could not send the verification code. Please try again. "},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response({
            "detail": "A verification has been sent to your new number."
        })


class ConfirmContactChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ContactChangeConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        channel = serializer.validated_data["channel"]
        code = serializer.validated_data["code"]

        if channel == "email":
            purpose = VerificationCode.Purpose.CHANGE_EMAIL,
            code_channel = VerificationCode.Channel.__or__
        else:
            purpose = VerificationCode.Purpose.CHANGE_PHONE,
            code_channel = VerificationCode.Channel.SMS,

        verification, error = verify_code(
            user=request.user,
            purpose=purpose,
            channel=code_channel,
            code=code,
        )

        if error:
            return Response(
                {"detail": error},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_value = verification.target_value.strip()

        if not new_value:
            return Response(
                {"detail": "The verification request is invalid. Request a new code. "},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user

        if channel == "email":
            if User.objects.filter(email__iexact=new_value).exclude(pk=user.pk).exists():
                return Response(
                    {"detail": "That email address is already in use. "},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user.email = new_value.lower()
            user.mail_verified = True

        else:
            if User.objects.filter(phone_number=new_value).exclude(pk=user.pk).exists():
                return Response(
                    {"detail": "That phone number is already in use"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.phone_number = new_value
            user.phone_verified = True

        user.save()
        return Response({
            "detail": (
                "Email address updated successfully."
                if channel == "email"
                else "Phone number updated successfully."
            )
        })



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])

        # Keep this session authenticated and update its password hash.
        # Other sessions using the old password hash will be invalidated.
        update_session_auth_hash(request, user)

        return Response({
            "detail": "Password changed successfully."
        })


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["identifier"].strip()

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            channel = VerificationCode.Channel.EMAIL
            destination_field = "email"
        else:
            user = User.objects.filter(phone_number=identifier).first()
            channel = VerificationCode.Channel.SMS
            destination_field = "phone_number"

        # Always return the same public response to reduce account enumeration.
        generic_response = {
            "detail": (
                "If an account matches those details, a password-reset "
                "code will be sent to the registered contact."
            )
        }

        if user is None:
            return Response(generic_response, status=status.HTTP_200_OK)

        destination = getattr(user, destination_field)

        try:
            code = create_verification_code(
                user=user,
                purpose=VerificationCode.Purpose.PASSWORD_RESET,
                channel=channel,
                destination=destination,
            )

            deliver_verification_code(
                channel=channel,
                destination=destination,
                code=code,
                purpose=VerificationCode.Purpose.PASSWORD_RESET,
            )

        except Exception:
            logger.exception("Failed to send password-reset verification code.")

            VerificationCode.objects.filter(
                user=user,
                purpose=VerificationCode.Purpose.PASSWORD_RESET,
                channel=channel,
                consumed_at__isnull=True,
            ).update(consumed_at=timezone.now())

        return Response(generic_response, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data["identifier"].strip()
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
            channel = VerificationCode.Channel.EMAIL
        else:
            user = User.objects.filter(phone_number=identifier).first()
            channel = VerificationCode.Channel.SMS

        # Use the same response for unknown accounts and invalid codes.
        invalid_response = Response(
            {"detail": "The verification code is invalid or expired."},
            status=status.HTTP_400_BAD_REQUEST,
        )

        if user is None:
            return invalid_response

        verification, error = verify_code(
            user=user,
            purpose=VerificationCode.Purpose.PASSWORD_RESET,
            channel=channel,
            code=code,
        )

        if error or verification is None:
            return invalid_response

        user.set_password(new_password)
        user.save(update_fields=["password"])

        return Response({
            "detail": "Password reset successfully. You can now log in."
        })
