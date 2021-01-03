from django.contrib import admin
from interface.models import *

admin.site.site_header = 'Online Judge GLUG'

admin.site.register(Programming_Language)

class ContestAdmin(admin.ModelAdmin): 
    list_display = ('contest_code', 'contest_name', 'start_time', 'end_time') 

admin.site.register(Contest, ContestAdmin)

class TestCaseInline(admin.TabularInline):
    model = Testcases
    fields = ['input_test', 'output_test']
    extra = 1

class QuestionAdmin(admin.ModelAdmin): 
    list_display = ('question_code', 'question_name', 'question_score')
    list_filter = ('contest',)
    inlines = [
        TestCaseInline,
    ]

admin.site.register(Question, QuestionAdmin)

class EditorialAdmin(admin.ModelAdmin): 
    list_display = ('contest','question','ques_name') 
    list_filter = ('contest','question')

admin.site.register(Editorial, EditorialAdmin)

class TestcaseAdmin(admin.ModelAdmin): 
    list_display = ('question',) 
    list_filter = ('question',)
    readonly_fields = ['output_hash', 'input_hash']

admin.site.register(Testcases, TestcaseAdmin)

class AnswerAdmin(admin.ModelAdmin): 
    list_display = ('contest','question','user') 
    list_filter = ('contest','question','ques_name','user')

admin.site.register(Answer, AnswerAdmin)

class JobAdmin(admin.ModelAdmin): 
    list_display = ('contest','question_name','coder') 
    list_filter = ('contest','question_name','coder','lang')

admin.site.register(Job, JobAdmin)

class Contest_ScoreAdmin(admin.ModelAdmin): 
    list_display = ('contest','coder','score') 
    list_filter = ('contest')

admin.site.register(Contest_Score)