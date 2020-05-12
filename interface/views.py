from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer
from interface.models import Question
from interface.tasks import execute
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
@permission_classes([AllowAny])
def submitCode(request):
    ext = request.data.get('ext')
    code = request.data.get('code')
    question = Question.objects.all().first()
    serializer = QuestionSerializer(question)
    execute.delay(serializer.data, None, code, ext)
    return Response({'message':'pls_wait'})
