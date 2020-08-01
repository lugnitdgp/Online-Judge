from django.contrib import admin
from interface.models import *

admin.site.site_header = 'Online Judge GLUG'

class ContestAdmin(admin.ModelAdmin): 
    list_display = ('contest_name', 'start_time', 'end_time') 

admin.site.register(Contest, ContestAdmin)

class QuestionAdmin(admin.ModelAdmin): 
    list_display = ('question_code', 'question_name', 'question_score')
    list_filter = ('contest',)

admin.site.register(Question, QuestionAdmin)

class EditorialAdmin(admin.ModelAdmin): 
    list_display = ('contest','question','ques_name') 
    list_filter = ('contest','question')

admin.site.register(Editorial, EditorialAdmin)

class TestcaseAdmin(admin.ModelAdmin): 
    list_display = ('question',) 
    list_filter = ('question',)

admin.site.register(Testcases, TestcaseAdmin)

class AnswerAdmin(admin.ModelAdmin): 
    list_display = ('contest','question','user') 
    list_filter = ('contest','question','ques_name','user')

admin.site.register(Answer, AnswerAdmin)

class JobAdmin(admin.ModelAdmin): 
    list_display = ('contest','question_name','coder') 
    list_filter = ('contest','question_name','coder','lang')

admin.site.register(Job, JobAdmin)

admin.site.register(Contest_Score)
admin.site.register(Config)