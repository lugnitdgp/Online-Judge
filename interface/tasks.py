from __future__ import absolute_import, unicode_literals

from celery import shared_task
from interface.models import *
from accounts.models import Coder
from judge.celery import app
from engine import script
import os
import json
from judge.settings import OUTPATH_DIR


def db_store(question, user, result, ac, wa,job_id):
    j = Job(question=question,
            coder=user,
            status=json.dumps(result),
            AC_no=ac,
            WA_no=wa,
            job_id=job_id)
    j.save()


@app.task
def execute(question, coder, code, lang):
    language = {
        "c": "c",
        "c++": "cpp",
        "java": "java",
        "python2": "py",
        "python3": "py"
    }
    ext = language[lang]
    filename = execute.request.id.__str__() + "." + ext
    try:
        with open(
                os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             filename), "w+") as file:
            file.write(code)
            file.close()
    except:
        print("Exception")
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
    question = Question.objects.get(question_name=question['question_name'])
    user = Coder.objects.get(name=coder['name'])
    testcases = Testcases.objects.filter(question=question)
    temp_output_file = os.path.join(OUTPATH_DIR, execute.request.id.__str__()+".txt")
    ac, wa = 0, 0
    if (ext == "c"):
        net_res = []
        for tests in testcases:
            result = script.run_c(f,
                                  question.time_limit, question.memory_limit,
                                  tests.input_path(), temp_output_file,
                                  tests.output_path())
            net_res.append(result)
            if (result['code'] == 1):
                break
            elif (result['code'] == 0
                  and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0
                  and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__())
    elif (ext == "cpp"):
        net_res = []
        for tests in testcases:
            result = script.run_cpp(f,
                                    question.time_limit, question.memory_limit,
                                    tests.input_path(), temp_output_file,
                                    tests.output_path())
            net_res.append(result)
            if (result['code'] == 1):
                break
            elif (result['code'] == 0
                  and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0
                  and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__())
    elif (ext == "py" and lang == "python3"):
        net_res = []
        for tests in testcases:
            result = script.run_python3(f, question.time_limit,
                                        question.memory_limit,
                                        tests.input_path(), temp_output_file,
                                        tests.output_path())
            net_res.append(result)
            if (result['code'] == 1):
                break
            elif (result['code'] == 0
                  and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0
                  and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__())
    elif (ext == "py" and lang == "python2"):
        net_res = []
        for tests in testcases:
            result = script.run_python2(f, question.time_limit,
                                        question.memory_limit,
                                        tests.input_path(), temp_output_file,
                                        tests.output_path())
            net_res.append(result)
            if (result['code'] == 1):
                break
            elif (result['code'] == 0
                  and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0
                  and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__())
    elif (ext == "java"):
        net_res = []
        for tests in testcases:
            result = script.run_java(f, question.time_limit,
                                     question.memory_limit, tests.input_path(),
                                     temp_output_file, tests.output_path())
            net_res.append(result)
            if (result['code'] == 1):
                break
            elif (result['code'] == 0
                  and result['status']['run_status'] == "AC"):
                ac += 1
            elif (result['code'] == 0
                  and result['status']['run_status'] == "WA"):
                wa += 1
        db_store(question, user, net_res, ac, wa, execute.request.id.__str__())
    else:
        result = {"code": 3, "message": "Language not supported"}
        db_store(question, user, result, ac, wa, execute.request.id.__str__())
    os.remove(f)
