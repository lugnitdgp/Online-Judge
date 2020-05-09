from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('interface.urls')),
    path('account/',include('accounts.urls')),
]
