from __future__ import absolute_import, unicode_literals

from celery import shared_task
from interface.models import *
from engine import script
import os
import json


def db_store(question, user, result):
    j = Job(question=question, user=user, status=json.dumps(result))
    j.save()

@shared_task
def execute(question, user, code, ext):
    filename = "test."+ ext
    try:
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),filename), "w+") as file:
            file.write(code)
            file.close()
    except:
        print("Exception")
    f = os.path.join(os.path.dirname(os.path.abspath(__file__)),filename)
    question = Question.objects.get(question_name = question['question_name'])
    testcases = Testcases.objects.filter(question=question)
    if (ext == "c"):
        for tests in testcases:
            result = script.run_c(f, tests.input_path(), tests.output_path())
            if (result['code'] == 1 or result['code'] == 2):
                db_store(question, user, result)
        db_store(question, user, result)
    elif (ext == "cpp"):
        for tests in testcases:
            result = script.run_cpp(f, tests.input_path(), tests.output_path())
            if (result['code'] == 1 or result['code'] == 2):
                db_store(question, user, result)
        db_store(question, user, result)
    elif (ext == "py"):
        for tests in testcases:
            result = script.run_python3(f, tests.input_path(),
                                        tests.output_path())
            if (result['code'] == 1 or result['code'] == 2):
                db_store(question, user, result)
    elif (ext == "java"):
        for tests in testcases:
            result = script.run_cpp(f, tests.input_path(), tests.output_path())
            if (result['code'] == 1 or result['code'] == 2):
                db_store(question, user, result)
        db_store(question, user, result)
    else:
        result = {"code": 3, "message": "Language not supported"}
        db_store(question, user, result)