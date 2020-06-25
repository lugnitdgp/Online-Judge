from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer, ContestSerializer
from interface.models import Question, Job, Testcases, Contest
from interface.tasks import execute
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
from urllib.parse import unquote
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
    query_set = Question.objects.filter(contest = contest)
    if contest.isStarted():
        serializer = QuestionListSerializer(query_set, many=True)
        return Response(serializer.data)
    if contest.isOver():
        return Response({'status': 302, 'message': 'Contest is Over'})
    return Response({'status':301, 'message':'Contest hasnt started'})


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
        question = Question.objects.get(question_code=request.data.get('q_id'),contest=contest)
        coder = Coder.objects.get(user=request.user)
        task = execute.delay(
            QuestionSerializer(question).data,
            CoderSerializer(coder).data, code, lang)
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
        job = Job.objects.get(coder=coder,
                              question=question,
                              job_id=request.data.get('task_id'))
        if job.AC_no == Testcases.objects.filter(question=question).count():
            if coder.check_solved(question.question_code) == False:
                coder.put_solved(question.question_code)
                coder.score += question.question_score
                coder.save()
        res = json.loads(job.status)
        job.delete()
        return Response(res)
    except Job.DoesNotExist:
        return Response({
            'status': 302,
            'message': 'Please wait. Answer being processed'
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    coder_array = []
    for (rank,
         coder) in enumerate(Coder.objects.order_by('-score', 'time_stamp'),
                             start=1):
        coder_array.append({
            "rank": rank,
            "name": coder.name,
            "score": coder.score,
            "image": coder.image_link
        })
    return Response(coder_array)