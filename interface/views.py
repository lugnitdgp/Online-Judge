from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer, ContestSerializer, SubmissionSerializer, PersonalSubmissionSerializer, AnswerSerializer, EditorialSerializer
from interface.models import Question, Job, Testcases, Contest, Contest_Score, Answer, Editorial
from interface.tasks import execute
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
from urllib.parse import unquote
from django.utils import timezone as t
from django.core.exceptions import ObjectDoesNotExist
from urllib.parse import quote
# Create your views here.


@api_view(['GET'])
@permission_classes([AllowAny])
def GetContestList(request):
    query_set = Contest.objects.all()
    serializer = ContestSerializer(query_set, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestionList(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    query_set = Question.objects.filter(contest=contest)
    if contest.isStarted() or contest.isOver():
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
        contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
        coder = Coder.objects.get(user=request.user)
        coder_time = coder.time_stamp
        time_dif = (t.now() - coder_time).total_seconds()
        if time_dif < 30:
            return Response({'status': 302, 'message': 'Please wait 30 sec before submitting another code'})
        coder.time_stamp = t.now()
        coder.save()
        task = execute.delay(
            QuestionSerializer(question).data,
            CoderSerializer(coder).data, code, lang,
            ContestSerializer(contest, context={
                "request": request
            }).data)
        return Response({'task_id': task.id, 'status': 200})
    except ObjectDoesNotExist:
        return Response({'status': 404, 'message': 'Wrong question code'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def status(request):
    try:
        coder = Coder.objects.get(user=request.user)
        contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
        penalty = contest.penalty
        penalty_total = penalty * (((t.now() - contest.start_time).total_seconds()) / 60)
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
        coder_contest_score = Contest_Score.objects.get_or_create(contest=contest, coder=coder)[0]
        answer = Answer.objects.get_or_create(question=question, user=coder, contest=contest)[0]
        job = Job.objects.get(coder=coder, question=question, job_id=request.data.get('task_id'))
        job.name = coder.first_name
        job.question_name = question.question_name
        answer.ques_name = question.question_name
        job.save()
        if job.AC_no == Testcases.objects.filter(question=question).count():
            if coder.check_solved(question.pk) == False:
                coder.put_solved(question.pk)
                coder.correct_answers += 1
                answer.correct += 1
                if contest.isOver() == False and contest.isStarted():
                    try:
                        mn_score = (int)(question.question_score / (contest.min_score))
                    except:
                        mn_score = question.question_score
                    score = question.question_score - penalty_total - (coder_contest_score.wa * contest.wa_penalty)
                    ques_score = max(mn_score, score)
                    coder_contest_score.score += ques_score
                    answer.score = ques_score
                    coder_contest_score.timestamp = t.now()
        else:
            if contest.isOver() == False and contest.isStarted():
                coder_contest_score.timestamp = t.now()
            coder_contest_score.wa += 1
            coder.wrong_answers += 1
            answer.wrong += 1
        coder.save()
        answer.save()
        coder_contest_score.save()
        res = json.loads(job.status)
        return Response(res)
    except Job.DoesNotExist:
        return Response({'status': 302, 'message': 'Please wait. Answer being processed'})


@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    coder_array = []
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    for (rank,
         participant) in enumerate(Contest_Score.objects.filter(contest=contest).order_by('-score', 'timestamp', 'wa'),
                                   start=1):
        query_set = Answer.objects.filter(contest=contest, user=participant.coder)
        serializer = AnswerSerializer(query_set, many=True)
        coder_array.append({
            "rank": rank,
            "name": participant.coder.first_name,
            "score": participant.score,
            "image": participant.coder.image_link,
            "answer": serializer.data
        })
    return Response(coder_array)


@api_view(['GET'])
@permission_classes([AllowAny])
def GetSubmissions(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    query_set = Job.objects.filter(contest=contest)
    serializer = SubmissionSerializer(query_set, many=True)
    if contest.isStarted():
        return Response(serializer.data)
    if contest.isOver():
        return Response(serializer.data)
    return Response({'status': 301, 'message': 'Contest has not started yet'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetPersonalSubmissions(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    coder = Coder.objects.get(user=request.user)
    query_set = Job.objects.filter(contest=contest, coder=coder)
    serializer = PersonalSubmissionSerializer(query_set, many=True)
    if contest.isStarted() or contest.isOver():
        return Response(serializer.data)
    return Response({'status': 301, 'message': 'Contest has not started yet'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAnswer(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    coder = Coder.objects.get(user=request.user)
    query_set = Answer.objects.filter(contest=contest, user=coder)
    serializer = AnswerSerializer(query_set, many=True)
    if contest.isStarted() or contest.isOver():
        return Response(serializer.data)
    return Response({'status': 301, 'message': 'Contest has not started yet'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetEditorialList(request):
    contest = Contest.objects.get(contest_code=request.GET['contest_id'])
    query_set = Question.objects.filter(contest=contest)
    serializer = QuestionListSerializer(query_set, many=True)
    if contest.isOver():
        return Response(serializer.data)
    return Response({'status': 301, 'message': 'Contest has not Ended yet'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def GetEditorial(request):
    contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
    question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
    try:
        editorial = Editorial.objects.get(question=question, contest=contest)
        editorial.code.open(mode="rb")
        encoded_editorial_content = quote(editorial.code.read())
        editorial.code.close()
        data = {
            'ques_name': question.question_name,
            'ques_text' : question.question_text,
            'solution' : editorial.solution,
            'code': encoded_editorial_content
        }
        return Response(data)
    except:
        return Response({'status': 301, 'message': 'Editorial not found, please contact the Admin!'})
