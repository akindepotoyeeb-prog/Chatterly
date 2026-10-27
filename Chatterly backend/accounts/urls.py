from django.urls import path
from .views import (RegisterView, VerificationRequestView, VerifyContactView, LoginView, LogoutView, csrf_token_view, CurrentUserView)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verification/request/", VerificationRequestView.as_view(), name="verification-request"),
    path("verification/confirm/", VerifyContactView.as_view(), name="verification-confirm"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("csrf/", csrf_token_view, name="csrf-token"),
]