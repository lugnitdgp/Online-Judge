from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer, ContestSerializer
from interface.models import Question, Job, Testcases, Contest, Contest_Score
from interface.tasks import execute
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
from urllib.parse import unquote
from django.utils import timezone as t
# Create your views here.


@api_view(['GET'])
@permission_classes([AllowAny])
def GetContestList(request):
    query_set = Contest.objects.all()
    serializer = ContestSerializer(query_set, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestionList(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    query_set = Question.objects.filter(contest=contest)
    if contest.isStarted():
        serializer = QuestionListSerializer(query_set, many=True)
        return Response(serializer.data)
    if contest.isOver():
        return Response({'status': 302, 'message': 'Contest is Over'})
    return Response({'status': 301, 'message': 'Contest hasnt started'})


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestion(request):
    try:
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        question = Question.objects.get(question_code=request.GET['q_id'], contest=contest)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)
    except ObjectDoesNotExist:
        return Response({'status': 404, "message": "Question Code is Invalid"})


@api_view(['POST'])
@permission_classes([
    IsAuthenticated,
])
def submitCode(request):
    lang = request.data.get('lang')
    code = unquote(request.data.get('code'))
    contest_code = request.data.get('contest_id')
    try:
        contest = Contest.objects.get(contest_code=contest_code)
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
        coder = Coder.objects.get(user=request.user)
        task = execute.delay(QuestionSerializer(question).data, CoderSerializer(coder).data, code, lang)
        return Response({'task_id': task.id, 'status': 200})
    except ObjectDoesNotExist:
        return Response({'status': 404, 'message': 'Wrong question code'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def status(request):
    try:
        coder = Coder.objects.get(user=request.user)
        contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
        coder_contest_score = Contest_Score.objects.get_or_create(contest=contest, coder=coder)[0]
        job = Job.objects.get(coder=coder, question=question, job_id=request.data.get('task_id'))
        if job.AC_no == Testcases.objects.filter(question=question).count():
            if coder.check_solved(question.pk) == False:
                coder.put_solved(question.pk)
                coder_contest_score.score += question.question_score
                coder_contest_score.timestamp = t.now()
                coder.save()
        else:
            coder_contest_score.wa += 1
            coder_contest_score.timestamp = t.now()
        coder_contest_score.save()
        res = json.loads(job.status)
        return Response(res)
    except Job.DoesNotExist:
        return Response({'status': 302, 'message': 'Please wait. Answer being processed'})


@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    coder_array = []
    contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
    for (rank,
         participant) in enumerate(Contest_Score.objects.filter(contest=contest).order_by('-score', 'timestamp', 'wa'),
                                   start=1):
        coder_array.append({
            "rank": rank,
            "name": participant.coder.name,
            "score": participant.score,
            "image": participant.coder.image_link
        })
    return Response(coder_array)