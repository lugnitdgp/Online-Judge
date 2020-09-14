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
from judge.settings import OUTPATH_DIR, ENGINE_PATH


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
def execute(question, coder, code, lang, contest):
    try:
        question = Question.objects.get(question_code=question['question_code'])
        user = Coder.objects.get(email=coder['email'])
        testcases = Testcases.objects.filter(question=question)
        contest = Contest.objects.get(contest_code=contest['contest_code'])
        ac, wa = 0, 0
        language = contest.contest_langs.get(name=lang)
        ext = language.ext
        filename = execute.request.id.__str__() + "." + ext
        try:
            with open(os.path.join(OUTPATH_DIR, filename), "w+") as file:
                file.write(code)
                file.close()
        except:
            print("File I/O Error")
        
        f = os.path.join(OUTPATH_DIR, filename)
        temp_output_file = os.path.join(OUTPATH_DIR, execute.request.id.__str__() + ".txt")
        time, mem = 0, 0
        net_res = []
        
        if (ext == "c"):
            for tests in testcases:
                result = script.run_c(
                    f, question.c_cpp_lim()[0], question.c_cpp_lim()[1], tests.input_path(),
                    temp_output_file, tests.output_path()
                )
                net_res.append(result)
                if (result['code'] == 1):
                    break
                elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                    ac += 1
                elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                    wa += 1
            db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)
        
        elif (ext == "cpp"):
            for tests in testcases:
                result = script.run_cpp(
                    f, question.c_cpp_lim()[0], question.c_cpp_lim()[1], tests.input_path(),
                    temp_output_file, tests.output_path()
                )
                net_res.append(result)
                if (result['code'] == 1):
                    break
                elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                    ac += 1
                elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                    wa += 1
            db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)
            
        elif (ext == "py" and lang == "python3"):
            for tests in testcases:
                result = script.run_python3(
                    f, question.python_lim()[0], question.python_lim()[1], tests.input_path(),
                    temp_output_file, tests.output_path()
                )
                net_res.append(result)
                if (result['code'] == 1):
                    break
                elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                    ac += 1
                elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                    wa += 1
            db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)
        
        elif (ext == "py" and lang == "python2"):
            for tests in testcases:
                result = script.run_python2(
                    f, question.python_lim()[0], question.python_lim()[1], tests.input_path(),
                    temp_output_file, tests.output_path()
                )
                net_res.append(result)
                if (result['code'] == 1):
                    break
                elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                    ac += 1
                elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                    wa += 1
            db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)
        
        elif (ext == "java"):
            for tests in testcases:
                result = script.run_java(
                    f, question.java_lim()[0], question.java_lim()[1], tests.input_path(),
                    temp_output_file, tests.output_path()
                )
                net_res.append(result)
                if (result['code'] == 1):
                    break
                elif (result['code'] == 0 and result['status']['run_status'] == "AC"):
                    ac += 1
                elif (result['code'] == 0 and result['status']['run_status'] == "WA"):
                    wa += 1
            db_store(question, user, net_res, ac, wa, execute.request.id.__str__(), contest, code, lang)
    
    except Programming_Language.DoesNotExist:
        result = {"code": 3, "message": "Language not supported"}
        db_store(question, user, result, ac, wa, execute.request.id.__str__(), contest, code, lang)
    
    os.remove(f)
