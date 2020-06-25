from django.urls import path, include
from interface import views

urlpatterns = [
    path('questions',views.GetQuestionList, name="GetQuestionList"),
    path("quesdetail",views.GetQuestion,name="GetQuestionDetail"),
    path('submit',views.submitCode, name="SubmitAnswer"),
    path('status', views.status, name="StatusForTheSubmittedAnswer"),
    path('leaderboard', views.leaderboard, name="LeaderBoardapi"),
    path('contests', views.GetContestList, name="Contest")
]