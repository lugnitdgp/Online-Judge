from django.urls import path, include
from interface import views

urlpatterns = [
    path('questions',views.GetQuestionList, name="GetQuestionList"),
    path("quesdetail",views.GetQuestion,name="GetQuestionDetail"),
]