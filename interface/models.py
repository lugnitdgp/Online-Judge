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
import hashlib


class Programming_Language(models.Model):
    name = models.CharField(max_length=16)
    ext = models.CharField(max_length=16)
    compile_command = models.CharField(max_length=255)
    run_command = models.CharField(max_length=255)
    multiplier_name = models.CharField(max_length=64)
    template = models.TextField(max_length=1024, blank=True)

    class Meta:
        verbose_name = "Programming Language"
        verbose_name_plural = "Programming Languages"
        
    def __str__(self):
        return self.name


class Contest(models.Model):
    contest_name = models.TextField(help_text="Name of Contest", blank=True)
    contest_code = models.TextField(blank=True, help_text="Code for Contest")
    contest_image = models.ImageField(upload_to="contest_images/")
    start_time = models.DateTimeField(default=t.now, help_text="Start time for contest")
    end_time = models.DateTimeField(default=t.now, help_text="End time for contest")
    contest_langs = models.ManyToManyField(Programming_Language)
    time_penalty = models.IntegerField(default = 0, help_text="penalty time in minutes")
    prize_form = models.CharField(blank=True, help_text='Eligibility form for prizes', max_length=100)

    def __str__(self):
        return self.contest_name + " " + self.contest_code

    def isStarted(self):
        return (t.now() > self.start_time and t.now() < self.end_time)

    def isOver(self):
        return (t.now() > self.end_time and t.now() > self.start_time)

    class Meta:
        ordering = ['end_time']
        verbose_name = "Contest"
        verbose_name_plural = "Contests"


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
    editorial_published = models.BooleanField(default=False, help_text="Check if editorial is declared or not")

    def __str__(self):
        return self.question_code
        
    class Meta:
        ordering = ['question_score']
        verbose_name = "Question"
        verbose_name_plural = "Questions"


def input_dir(instance, filename):
    return "testcases/ques_{}".format(instance.question.id) + "/test_{}/".format(instance.test_case_no) + filename


def output_dir(instance, filename):
    return "testcases/ques_{}".format(instance.question.id) + "/test_{}/".format(instance.test_case_no) + filename


class Testcases(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    test_case_no = models.IntegerField(default=1, help_text="Test Case ID for the particular question")
    input_test = models.FileField(upload_to=input_dir, help_text="Input test case")
    output_test = models.FileField(upload_to=output_dir, help_text="Output test case")
    input_hash = models.SlugField(max_length=128)
    output_hash = models.SlugField(max_length=128)

    class Meta:
        verbose_name = "Test case"
        verbose_name_plural  = "Test cases"

    def __str__(self):
        return ("Testcase of " + self.question.question_code)

    def input_path(self):
        return self.input_test.path

    def output_path(self):
        return self.output_test.path

    def save(self, *args, **kwargs):
        hash_in = hashlib.sha512()
        hash_out = hashlib.sha512()
        buff_size = 65536
        end1 = False
        end2 = False
        while True:
            if not end1:
                data = self.input_test.read(buff_size)
                if not data:
                    end1 = True
                hash_in.update(data)
            if not end2:
                data = self.output_test.read(buff_size)
                if not data:
                    end1 = True
                hash_out.update(data)
            if not end1 and not end2:
                break
        self.input_hash = hash_in.hexdigest()
        self.output_hash = hash_out.hexdigest()
        super(Testcases, self).save(*args, **kwargs)


class Job(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, null=True)
    coder = models.ForeignKey(Coder, blank=True, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=True, help_text="Name goes here")
    question_name = models.CharField(max_length=200, null=True, help_text="Question Name goes here")
    code = models.TextField(blank=True, help_text="Code goes here")
    lang = models.CharField(max_length=100, blank=True, help_text="language of the code")
    compile_error = models.BooleanField(default=False, help_text="To check if a compiler error has occured")
    status = models.TextField(blank=True, help_text="Status in json format. Please don't touch it.")
    AC_no = models.IntegerField(default=0, help_text="Number of correct answers for this job")
    WA_no = models.IntegerField(default=0, help_text="Number of wrong answers for this job")
    job_id = models.CharField(max_length=200, null=True, unique=True, help_text="Celery Job id for the current task")
    timestamp = models.DateTimeField(default=t.now, help_text="Latest submission")

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Job"
        verbose_name_plural = 'Jobs'

    def __str__(self):
        return str(self.id) + " " + self.coder.name

@receiver(pre_delete, sender=Testcases)
def testcases_delete(sender, instance, using, **kwargs):
    instance.input_test.delete(save=False)
    instance.output_test.delete(save=False)


class Answer(models.Model):
    user = models.ForeignKey(Coder, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    ques_name = models.CharField(max_length=200, blank=True, null=True, help_text="Question name")
    correct = models.IntegerField(default=0, help_text="Number of correct attempts of the Question")
    wrong = models.IntegerField(default=0, help_text="Number of wrong attempts of the Question")
    score = models.IntegerField(default=0, help_text="Score of the Question")
    timestamp = models.DateTimeField(default=t.now, help_text="Time of submission")

    class Meta:
        verbose_name = "Answer"
        verbose_name_plural = "Answers"

    def __str__(self):
        return self.question.question_name + " " + self.user.name


class Contest_Score(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    coder = models.ForeignKey(Coder, on_delete=models.CASCADE)
    score = models.IntegerField(default=0, help_text="Score of the given user in the given contest")
    timestamp = models.DurationField(blank=True, null=True, help_text="Penalty Time of submission")

    class Meta:
        verbose_name = "Contest Score"
        verbose_name_plural = "Contest Scores"

    def __str__(self):
        return self.contest.contest_name + " " + self.coder.name


class Editorial(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    ques_name = models.CharField(max_length=200, null=True, help_text="Question Name goes here")
    solution = models.TextField(blank=True, help_text="Hint and Explanation Goes Here")
    code = models.FileField(upload_to="editorial/", help_text="Editorial file")

    class Meta:
        verbose_name = "Editorial"
        verbose_name_plural = "Editorials"
        
    def __str__(self):
        return self.contest.contest_name

class Announcements(models.Model):
    text = models.TextField(max_length=100, help_text="New Announcements")

    class Meta:
        verbose_name = "Announcement"
        verbose_name_plural = "Announcements"

    def __str__(self):
        return str(self.id)

class Rules(models.Model):
    text = models.TextField(help_text="Rules for the Entire OJ")

    class Meta:
        verbose_name = "Rule"
        verbose_name_plural = "Rules"

    def __str__(self):
        return str(self.id)
    
class Sponsor(models.Model):
    name = models.CharField(max_length=128, blank=True, help_text="Sponsor name goes here")
    logo = models.ImageField(upload_to="sponsor_logos/", blank=True, null=True, help_text="Sponsor logo")

    class Meta:
        verbose_name = "Sponsor"
        verbose_name_plural = "Sponsors"

    def __str__(self):
        return str(self.name)