from django.urls import path, include
from accounts.views import *
from knox.views import LogoutView

urlpatterns = [
    path('social_login', SocialLogin.as_view(), name="SocialLogin"),
    path('custom_login', CustomLogin.as_view(), name="CustomLogin"),
    path('logout', LogoutView.as_view(), name="logout"),
    path('register', Register.as_view(), name="register"),
    path('oauth/google', google_oauth, name="google_oauth"),
]