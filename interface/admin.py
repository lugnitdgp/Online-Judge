from django.contrib import admin
from interface.models import *
# Register your models here.
admin.site.site_header = 'Online Judge GLUG'


admin.site.register(Coder)
admin.site.register(Question)
admin.site.register(Answer)