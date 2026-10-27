from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False,)

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "username",
            "password",
            "confirm_password",
        ]    

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "The passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)


class ChangeEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField()

    def validate_new_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        if not value:
            raise serializers.ValidationError(
                "Email is required."
            )
        return value

class ChangePhoneSerializer(serializers.Serializer):
    new_phone_number = serializers.CharField(max_length=20)

    def validate_new_phone_number(self, value):
        value = value.strip().lower()

        if User.objects.filter(phone_number=value):
            raise serializers.ValidationError(
                "An account with this phone number already exists."
            )
        if not value:
            raise serializers.ValidationError(
                "Phone number is required."
            )
        return value


class ContactChangeConfirmSerializer(serializers.Serializer):
    channel = serializers.ChoiceField(
        choices=["email", "sms"]
    )
    code = serializers.RegexField(
        regex=r"^\d{6}$",
        error_messages={"invalid": "Enter the six-digit verification code."}
    )
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    confirm_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        user = self.context["request"].user

        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Your current password is incorrect. "}
            )
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "The passwords do not match."}
            )

        try:
            validate_password(attrs["new_password"], user=user)

        except Exception as exc:
            from django.core.exceptions import ValidationError
            if isinstance(exc, ValidationError):
                raise serializers.ValidationError({
                    "new_password": list(exc.messages)
                })
            raise
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)


class PasswordResetConfirmSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)

    code = serializers.RegexField(
        regex=r"^\d{6}$",
        error_messages={
            "invalid": "Enter the six-digit verification code sent to you"
        }
    )
    new_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    confirm_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "The passwords do not match."}
            )

        try:
            validate_password(attrs["new_password"])
        except Exception as exc:
            from django.core.exceptions import ValidationError
            if isinstance(exc, ValidationError):
                raise serializers.ValidationError({
                    "new_password": list(exc.messages)
                })
            raise
        return attrs
