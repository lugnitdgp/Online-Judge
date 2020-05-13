from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer
from interface.models import Question
from interface.tasks import execute
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
# Create your views here.


@api_view(['GET'])
@permission_classes([AllowAny])
def GetQuestionList(request):
    query_set = Question.objects.order_by('pk')
    serializer = QuestionListSerializer(query_set, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
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
    question = Question.objects.all().first()
    coder = Coder.objects.get(user=request.user)
    execute.delay(
        QuestionSerializer(question).data,
        CoderSerializer(coder).data, code, lang)
    return Response({'message': 'pls_wait'})
