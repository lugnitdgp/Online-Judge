from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from judge.settings import TEST_CASE_DIR
from shutil import rmtree
import os
from accounts.models import Coder
from tinymce.models import HTMLField


class Config(models.Model):
    start_time = models.DateTimeField(default=t.now, help_text="Time and Date the contest starts")
    end_time = models.DateTimeField(default=t.now, help_text="Time and Date the contest ends")

    def __str__(self):
        return "Server wide config for start and end time"


class Contest(models.Model):
    contest_name = models.TextField(help_text="Name of Contest", blank=True)
    contest_code = models.TextField(blank=True, help_text="Code for Contest")
    contest_image = models.ImageField(upload_to="contest_images/", blank=True, null=True)
    penalty = models.IntegerField(default=0, help_text="Add Penalty multiplier per minute")
    wa_penalty = models.IntegerField(default=0, help_text="Add Penalty for WAs, TLEs etc")
    min_score = models.IntegerField(default=1, help_text="Add the fraction multiplier to question score Eg. 3 for 1/3")
    start_time = models.DateTimeField(default=t.now, help_text="Start time for contest")
    end_time = models.DateTimeField(default=t.now, help_text="End time for contest")

    def __str__(self):
        return self.contest_name + " " + self.contest_code

    def isStarted(self):
        return (t.now() > self.start_time and t.now() < self.end_time)

    def isOver(self):
        return (t.now() > self.end_time and t.now() > self.start_time)


class Question(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, null=True)
    question_code = models.CharField(max_length=50, blank=True, help_text="Code for the question")
    question_name = models.CharField(max_length=50, blank=True, help_text="Name of the question")
    question_text = HTMLField()
    question_image = models.ImageField(blank=True, help_text="Optional Image if the question demands")
    question_score = models.IntegerField(default=0, blank=True, help_text="Score for solving this problem")
    input_example = models.TextField(blank=True, help_text="Example showing how should the input look")
    output_example = models.TextField(blank=True, help_text="Example showing how should the output look")
    time_limit = models.IntegerField(default=1, help_text="Time Limit of the question for C")
    mem_limit = models.BigIntegerField(default=100000, help_text="Memory Limit for C")
    c_cpp_multiplier = models.IntegerField(default=1, help_text="Time and Memory Limit multiplier for C/C++")
    python_multiplier = models.IntegerField(default=2, help_text="Time and Memory limit multiplier for Python")
    java_multipler = models.IntegerField(default=2, help_text="Time and Memory limit multipler for JAVA")

    def __str__(self):
        return self.question_code

    def c_cpp_lim(self):
        return [self.c_cpp_multiplier * self.time_limit, self.c_cpp_multiplier * self.mem_limit]

    def python_lim(self):
        return [self.python_multiplier * self.time_limit, self.python_multiplier * self.mem_limit]

    def java_lim(self):
        return [self.java_multipler * self.time_limit, self.java_multipler * self.mem_limit]

    def save(self, *args, **kwargs):
        super(Question, self).save(*args, **kwargs)
        if os.path.isdir(os.path.join(TEST_CASE_DIR, "ques{}".format(self.pk))):
            pass
        else:
            os.mkdir(os.path.join(TEST_CASE_DIR, "ques{}".format(self.pk)))

    class Meta:
        ordering = ['question_score']

def input_dir(instance, filename):
    return os.path.join(TEST_CASE_DIR, "ques_{}".format(instance.question.id), "test_{}".format(instance.test_case_no), filename)

def output_dir(instance, filename):
    return os.path.join(TEST_CASE_DIR, "ques_{}".format(instance.question.id), "test_{}".format(instance.test_case_no), filename)

class Testcases(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    test_case_no = models.IntegerField(default= 1, help_text="Test Case ID for the particular question")
    input_test = models.FileField(upload_to=input_dir, help_text="Input test case")
    output_test = models.FileField(upload_to=output_dir, help_text="Output test case")

    def __str__(self):
        return ("Testcase of " + self.question.question_code)

    def input_path(self):
        return self.input_test.path

    def output_path(self):
        return self.output_test.path

class Job(models.Model):
    question = models.ForeignKey(Question, blank=True, null=True, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, null=True)
    coder = models.ForeignKey(Coder, blank=True, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True, help_text="Name goes here")
    question_name = models.CharField(max_length=200, null=True, help_text="Question Name goes here")
    code = models.TextField(blank=True, help_text="Code goes here")
    lang = models.CharField(max_length=100, blank=True, help_text="language of the code")
    status = models.TextField(blank=True, help_text="Status in json format. Please don't touch it.")
    AC_no = models.IntegerField(default=0, help_text="Number of correct answers for this job")
    WA_no = models.IntegerField(default=0, help_text="Number of wrong answers for this job")
    job_id = models.CharField(max_length=200, null=True, unique=True, help_text="Celery Job id for the current task")
    timestamp = models.DateTimeField(default=t.now, help_text="Latest submission")

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.question.question_code + " " + self.coder.name


@receiver(pre_delete, sender=Question)
def ques_delete(sender, instance, using, **kwargs):
    rmtree(os.path.join(TEST_CASE_DIR, "ques{}".format(instance.pk)))


@receiver(pre_delete, sender=Testcases)
def testcases_delete(sender, instance, using, **kwargs):
    os.remove(
        os.path.join(os.path.join(TEST_CASE_DIR, "ques{}".format(instance.question.pk)),
                     "input{}.in".format(instance.pk)))
    os.remove(
        os.path.join(os.path.join(TEST_CASE_DIR, "ques{}".format(instance.question.pk)),
                     "output{}.out".format(instance.pk)))

class Answer(models.Model):
    user = models.ForeignKey(Coder, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest ,on_delete=models.CASCADE)
    ques_name = models.CharField(max_length=200, blank=True, null=True, help_text="Question name")
    correct = models.IntegerField(default=0, help_text="Number of correct attempts")
    wrong = models.IntegerField(default=0, help_text="Number of wrong attempts")
    score = models.IntegerField(default=0, help_text="Score of the question")

    def __str__(self):
        return self.question.question_name + " " + self.user.name

class Contest_Score(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    coder = models.ForeignKey(Coder, on_delete=models.CASCADE)
    score = models.IntegerField(default=0, help_text="Score of the given user in the given contest")
    wa = models.IntegerField(default=0, help_text="Number of WAs of the user")
    timestamp = models.DateTimeField(default=t.now, help_text="Latest submission")

    def __str__(self):
        return self.contest.contest_name + " " + self.coder.name

class Editorial(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    ques_name = models.CharField(max_length=200, null=True, help_text="Question Name goes here")
    solution = models.TextField(blank=True, help_text="Hint and Explanation Goes Here")
    code = HTMLField()

    def __str__(self):
        return self.contest.contest_name