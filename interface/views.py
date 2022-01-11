from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN, HTTP_429_TOO_MANY_REQUESTS, HTTP_226_IM_USED, HTTP_401_UNAUTHORIZED, HTTP_503_SERVICE_UNAVAILABLE
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from interface.serializers import QuestionSerializer, QuestionListSerializer, ContestSerializer, SubmissionSerializer, PersonalSubmissionSerializer, AnswerSerializer, EditorialSerializer, AnnouncementsSerializer, RulesSerializer, SponsorSerializer
from interface.models import Question, Job, Testcases, Contest, Contest_Score, Answer, Editorial, Announcements, Rules, Sponsor
# from interface.tasks import execute
from judge.celery import app
from accounts.serializers import CoderSerializer
from accounts.models import Coder
from django.core.exceptions import ObjectDoesNotExist
import json
from urllib.parse import unquote
from django.utils import timezone as t
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from judge.settings import MEDIA_URL
from datetime import timedelta
# Create your views here.


@api_view(['GET'])
@permission_classes([AllowAny])
def GetContestList(request):
    try :
        query_set = Contest.objects.all()
        serializer = ContestSerializer(query_set, many=True, context={'request': request})
        return Response(serializer.data, status = HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response('Contest does not exist', status = HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def GetContest(request, contest_code):
    try:
        query_set = Contest.objects.filter(contest_code=contest_code)[0]
        serializer = ContestSerializer(query_set, context={'request': request})
        return Response(serializer.data, status = HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response('Contest does not exist', status = HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestionList(request):
    try :
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        query_set = Question.objects.filter(contest=contest).order_by('question_score','pk')
        if contest.isStarted() or contest.isOver() or request.user.is_staff:
            serializer = QuestionListSerializer(query_set, many=True)
            return Response(serializer.data, status = HTTP_200_OK)
        if contest.isOver():
            return Response("Contest is Over", status = HTTP_403_FORBIDDEN)
        return Response("Contest hasnt started", status = HTTP_403_FORBIDDEN)
    except ObjectDoesNotExist:
        return Response("Contest does not exist", status = HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([
    IsAuthenticated,
])
def GetQuestion(request):
    try:
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        question = Question.objects.get(question_code=request.GET['q_id'], contest=contest)
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status = HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response("Question Code is Invalid", status = HTTP_404_NOT_FOUND)
    except MultipleObjectsReturned:
        question = Question.objects.filter(question_code=request.GET['q_id'], contest=contest)[0]
        serializer = QuestionSerializer(question)
        return Response(serializer.data, status = HTTP_200_OK)


@api_view(['POST'])
@permission_classes([
    IsAuthenticated,
])
def submitCode(request):
    lang = request.data.get('lang')
    code = request.data.get('code')
    try:
        try:
            contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
            question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
            testcases = Testcases.objects.filter(question=question)
            coder = Coder.objects.get(user=request.user)
            language = contest.contest_langs.get(name=lang)
        except MultipleObjectsReturned:
            question = Question.objects.filter(question_code=request.data.get('q_id'), contest=contest)[0]
        except ObjectDoesNotExist:
            return Response('Does not exist', status = HTTP_404_NOT_FOUND)

        coder_time = coder.time_stamp
        time_dif = (t.now() - coder_time).total_seconds()
        if time_dif < 30:
            return Response('Please wait 30 sec before submitting another code', status = HTTP_429_TOO_MANY_REQUESTS)
        coder.time_stamp = t.now()
        coder.save()

        input_file_urls, output_file_urls, input_file_hashes, output_file_hashes = [], [], [], []
        for test in testcases:
            input_file_urls.append(request.build_absolute_uri(test.input_test.url))
            output_file_urls.append(request.build_absolute_uri(test.output_test.url))
            input_file_hashes.append(test.input_hash)
            output_file_hashes.append(test.output_hash)

        multiplier = getattr(question, language.multiplier_name)
        time, mem = question.time_limit * multiplier, question.mem_limit * multiplier

        exec_args = {"time": time, "mem": mem}

        task = app.send_task("tasks.execute",
                             kwargs={
                                 "input_file_urls": input_file_urls,
                                 "input_file_hash": input_file_hashes,
                                 "output_file_hash": output_file_hashes,
                                 "output_file_urls": output_file_urls,
                                 "coder": CoderSerializer(coder).data,
                                 "code": code,
                                 "lang": lang,
                                 "contest": ContestSerializer(contest, context={
                                     "request": request
                                 }).data,
                                 "exec_args": exec_args
                             })
        return Response(task.id, status = HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response('Wrong question code', status = HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def status(request):
    fail_check = app.AsyncResult(request.data.get('task_id'))
    if fail_check.failed():
        return Response("Service Temporarily Unavailable please try again", status=HTTP_503_SERVICE_UNAVAILABLE)
    coder = Coder.objects.get(user=request.user)
    contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
    try:
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
        coder_contest_score = Contest_Score.objects.get_or_create(contest=contest, coder=coder)[0]
        answer = Answer.objects.get_or_create(question=question, user=coder, contest=contest)[0]
    except MultipleObjectsReturned:
        question = Question.objects.filter(question_code=request.data.get('q_id'), contest=contest)[0]
    except ObjectDoesNotExist:
        return Response('Does not exist', status = HTTP_404_NOT_FOUND)
    try:
        job = Job.objects.get(coder=coder, job_id=request.data.get('task_id'))
    except Job.DoesNotExist:
        return Response('Still Processing', status=HTTP_226_IM_USED)
    job.name = coder.first_name
    job.question_name = question.question_name
    answer.ques_name = question.question_name
    job.save()
    if job.AC_no == Testcases.objects.filter(question=question).count():
        if coder.check_solved(question.pk) == False:
            coder.put_solved(question.pk)
            answer.correct += 1
            if contest.isOver() == False and contest.isStarted() or request.user.is_staff:
                coder_contest_score.score += question.question_score
                answer.score = question.question_score
                answer.timestamp = t.now() + timedelta(minutes=contest.time_penalty*answer.wrong)
                if coder_contest_score.timestamp == None :
                    coder_contest_score.timestamp = (answer.timestamp - contest.start_time)
                else:
                    coder_contest_score.timestamp += (answer.timestamp - contest.start_time)
    else:
        if contest.isOver() == False and contest.isStarted() or request.user.is_staff:
            if not job.compile_error:
                answer.timestamp = t.now()
                answer.wrong += 1
    coder.save()
    answer.save()
    coder_contest_score.save()
    res = json.loads(job.status)
    return Response(res, status = HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    try:
        try:
            contest = Contest.objects.get(contest_code=request.GET['contest_id'])
            time = Contest_Score.objects.filter(contest=contest).order_by('-score', 'timestamp')[0].timestamp
        except ObjectDoesNotExist:
            return Response('contest does not exist', status = HTTP_404_NOT_FOUND)
        coder_array = []
        rank_cnt = 1
        for (rank, participant) in enumerate(Contest_Score.objects.filter(contest=contest).order_by('-score', 'timestamp'),
                                   start=1):
            query_set = Answer.objects.filter(contest=contest, user=participant.coder)
            serializer = AnswerSerializer(query_set, many=True)
            if time != participant.timestamp:
                rank_cnt += 1
            time = participant.timestamp
            coder_array.append({
                "rank": rank_cnt,
                "name": participant.coder.first_name,
                "score": participant.score,
                "image": participant.coder.image_link,
                "answer": serializer.data
            })
        return Response(coder_array, status = HTTP_200_OK)
    except:
        return Response('No object found', status = HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def GetSubmissions(request):
    try :
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        query_set = Job.objects.filter(contest=contest)
        serializer = SubmissionSerializer(query_set, many=True)
        if contest.isStarted() or contest.isOver() or request.user.is_staff:
            return Response(serializer.data, status = HTTP_200_OK)
        return Response('Contest has not started yet', status = HTTP_403_FORBIDDEN)
    except ObjectDoesNotExist:
        return Response('Object not found', status = HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetPersonalSubmissions(request):
    try :
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        coder = Coder.objects.get(user=request.user)
        query_set = Job.objects.filter(contest=contest, coder=coder)
        serializer = PersonalSubmissionSerializer(query_set, many=True)
        if contest.isStarted() or contest.isOver() or request.user.is_staff:
            return Response(serializer.data)
        return Response('Contest has not started yet', status = HTTP_403_FORBIDDEN)
    except :
        return Response('Does not exist', status = HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetAnswer(request):
    try :
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        coder = Coder.objects.get(user=request.user)
        query_set = Answer.objects.filter(contest=contest, user=coder)
        serializer = AnswerSerializer(query_set, many=True)
        if contest.isStarted() or contest.isOver() or request.user.is_staff:
            return Response(serializer.data)
        return Response('Contest has not started yet', status = HTTP_403_FORBIDDEN)
    except ObjectDoesNotExist:
        return Response('Object does not exist', status = HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def GetEditorialList(request):
    try :
        contest = Contest.objects.get(contest_code=request.GET['contest_id'])
        query_set = Question.objects.filter(contest=contest)
        serializer = QuestionListSerializer(query_set, many=True)
        if contest.isOver():
            return Response(serializer.data)
        return Response('Contest has not started yet', status = HTTP_403_FORBIDDEN   )
    except ObjectDoesNotExist:
        return Response('Object does not exist',status = HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def GetEditorial(request):
    contest = Contest.objects.get(contest_code=request.data.get('contest_id'))
    try:
        question = Question.objects.get(question_code=request.data.get('q_id'), contest=contest)
    except MultipleObjectsReturned:
        question = Question.objects.filter(question_code=request.data.get('q_id'), contest=contest)[0]
    try:
        editorial = Editorial.objects.get(question=question, contest=contest)
        editorial.code.open(mode="rb")
        encoded_editorial_content = editorial.code.read()
        editorial.code.close()
        data = {
            'ques_name': question.question_name,
            'ques_text': question.question_text,
            'solution': editorial.solution,
            'code': encoded_editorial_content
        }
        return Response(data, status = HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response('Object Does not exist', status = HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([AllowAny])
def getAnnouncements(request):
    try:
        announcements = Announcements.objects.all()
        serializer = AnnouncementsSerializer(announcements, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    except:
        return Response('No Announcements found', status=HTTP_404_NOT_FOUND)
        
@api_view(["GET"])
@permission_classes([AllowAny])
def getRules(request):
    try:
        rules = Rules.objects.all()
        serializer = RulesSerializer(rules, many=True)
        return Response(serializer.data, status=HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response('No Rules found', status=HTTP_404_NOT_FOUND)

@api_view(["GET"])
@permission_classes([AllowAny])
def getSponsors(request):
    try:
        sponsors = Sponsor.objects.all()
        serializer = SponsorSerializer(sponsors, many=True, context={
            'request':request
        })
        return Response(serializer.data, status=HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response("No Sponsors found", status=HTTP_404_NOT_FOUND)
