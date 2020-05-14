from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer
from interface.models import Question, Job, Testcases
from interface.tasks import execute
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
# Create your views here.


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestionList(request):
    query_set = Question.objects.order_by('pk')
    serializer = QuestionListSerializer(query_set, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestion(request):
    try:
        question = Question.objects.get(question_code=request.GET['q_id'])
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
    code = request.data.get('code')
    try:
        question = Question.objects.get(question_code=request.data.get('q_id'))
        coder = Coder.objects.get(user=request.user)
        execute.delay(
            QuestionSerializer(question).data,
            CoderSerializer(coder).data, code, lang)
        return Response({'message': 'pls_wait'})
    except ObjectDoesNotExist:
        return Response({'status': 404, 'message': 'Wrong question code'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def status(request):
    try:
        coder = Coder.objects.get(user = request.user)
        question = Question.objects.get(question_code = request.data.get('q_id'))
        job = Job.objects.get(coder = coder, question = question)
        if job.AC_no == Testcases.objects.filter(question = question).count():
            if coder.check_solved(question.question_code) == False:
                coder.put_solved(question.question_code)
                coder.score += question.question_score
                coder.save()
        res = json.loads(job.status)
        job.delete()
        return Response(res)
    except Job.DoesNotExist:
        return Response({'status':302, 'message':'Please wait. Answer being processed'})