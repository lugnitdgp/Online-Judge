from django.urls import path, include
from interface import views

urlpatterns = [
    path('questions', views.GetQuestionList, name="GetQuestionList"),
    path("quesdetail", views.GetQuestion, name="GetQuestionDetail"),
    path('submit', views.submitCode, name="SubmitAnswer"),
    path('status', views.status, name="StatusForTheSubmittedAnswer"),
    path('leaderboard', views.leaderboard, name="LeaderBoardapi"),
    path('contests', views.GetContestList, name="Contest"),
    path('contest/<contest_code>/',views.GetContest, name="ContestCode"),
    path('submissions', views.GetSubmissions, name="submission"),
    path('personalsubmissions', views.GetPersonalSubmissions, name="personalsubmission"),
    path('getanswer', views.GetAnswer, name="getanswer"),
    path('geteditoriallist', views.GetEditorialList, name="geteditoriallist"),
    path('geteditorial', views.GetEditorial, name="geteditorial"),
    path('check', views.check)
]