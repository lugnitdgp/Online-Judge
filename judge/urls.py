from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('interface.urls')),
    path('account/',include('accounts.urls')),
    path('tinymce/', include('tinymce.urls')),
]
