from django.urls import path, include
from accounts.views import *
from knox.views import LogoutView

urlpatterns = [
    path('login', Login.as_view(), name="login"),
    path('logout', LogoutView.as_view(), name="logout")    
]