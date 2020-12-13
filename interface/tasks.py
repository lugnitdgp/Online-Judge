from __future__ import absolute_import, unicode_literals
from celery import shared_task
from interface.models import *
from interface.models import Contest, Programming_Language
from accounts.models import Coder
from judge.celery import app
from engine import script
import os
import json
from django.utils import timezone as t
from judge.settings import OUTPATH_DIR, ENGINE_PATH, MEDIA_URL
import requests
from decouple import config


def db_store(question, user, result, ac, wa, job_id, contest, code, lang):
    j = Job(question=question,
            coder=user,
            code=code,
            status=json.dumps(result),
            AC_no=ac,
            WA_no=wa,
            job_id=job_id,
            contest=contest,
            timestamp=t.now(),
            lang=lang)
    j.save()


@app.task
def execute(question, coder, code, lang, contest, base_uri):

    executor_url = config("EXECUTOR_URL")
    try:
        question = Question.objects.get(question_code=question['question_code'])
        user = Coder.objects.get(email=coder['email'])
        testcases = Testcases.objects.filter(question=question)
        contest = Contest.objects.get(contest_code=contest['contest_code'])
        ac, wa = 0, 0
        language = contest.contest_langs.get(name=lang)
        ext = language.ext
        filename = execute.request.id.__str__() + "." + ext
        # try:
        #     with open(os.path.join(OUTPATH_DIR, filename), "w+") as file:
        #         file.write(code)
        #         file.close()
        # except:
        #     print("File I/O Error")
        
        # f = os.path.join(OUTPATH_DIR, filename)
        # temp_output_file = os.path.join(OUTPATH_DIR, execute.request.id.__str__() + ".txt")
        # net_res = []
        multiplier = getattr(question, language.multiplier_name) 
        time, mem = question.time_limit*multiplier, question.mem_limit*multiplier

        input_file_urls, output_file_urls, input_file_hashes, output_file_hashes = [], [], [], []
        for test in testcases:
            input_file_urls.append(base_uri + test.input_test.url.split(MEDIA_URL)[-1])
            output_file_urls.append(base_uri + test.output_test.url.split(MEDIA_URL)[-1])
            input_file_hashes.append(test.input_hash)
            output_file_hashes.append(test.output_hash)

        exec_args = {
            "code" : code,
            "filename" : filename,
            "time" : time,
            "mem" : mem,
            "compile_command" : language.compile_command,
            "run_command" : language.run_command
        }
        # for tests in testcases:
        #     result = script.run(
        #         "f, time, mem, tests.input_path(), temp_output_file, tests.output_path(), lang
        #     )
        #    net_res.append(result)

        param = {
            "input_file_urls": input_file_urls,
            "input_file_hashes": input_file_hashes,
            "output_file_hashes": output_file_hashes,
            "output_file_urls": output_file_urls,
            "exec_args": exec_args
        }

        net_res = requests.post(executor_url, json=param)
        net_res = net_res.json()

        for result in net_res:
            if (result['code'] == 1):
                break
            elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)

        # os.remove(f)
    
    except Programming_Language.DoesNotExist:
        result = {"code": 3, "message": "Language not supported"}
        db_store(question, user, result, ac, wa, execute.request.id.__str__(), contest, code, lang)
    
    
