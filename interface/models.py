from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from judge.settings import TEST_CASE_DIR
from shutil import rmtree
import os
from accounts.models import Coder


class Config(models.Model):
    start_time = models.DateTimeField(
        default=t.now, help_text="Time and Date the contest starts")
    end_time = models.DateTimeField(default=t.now,
                                    help_text="Time and Date the contest ends")

    def __str__(self):
        return "Server wide config for start and end time"


class Question(models.Model):
    question_code = models.CharField(max_length=50,
                                     blank=True,
                                     help_text="Code for the question")
    question_name = models.CharField(max_length=50,
                                     blank=True,
                                     help_text="Name of the question")
    question_text = models.TextField(
        blank=True, help_text="The entire text for the question")
    question_image = models.ImageField(
        blank=True, help_text="Optional Image if the question demands")
    question_score = models.IntegerField(
        default=0, blank=True, help_text="Score for solving this problem")
    input_example = models.TextField(
        blank=True, help_text="Example showing how should the input look")
    output_example = models.TextField(
        blank=True, help_text="Example showing how should the output look")
    time_limit = models.IntegerField(default=1,
                                     help_text="Time limit for the question")
    memory_limit = models.IntegerField(
        default=100000, help_text="Memory limit for the question")

    def __str__(self):
        return self.question_text

    def save(self, *args, **kwargs):
        super(Question, self).save(*args, **kwargs)
        if os.path.isdir(os.path.join(TEST_CASE_DIR,
                                      "ques{}".format(self.pk))):
            pass
        else:
            os.mkdir(os.path.join(TEST_CASE_DIR, "ques{}".format(self.pk)))


class Testcases(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    input_test = models.TextField(blank=True, help_text="Input test case")
    output_test = models.TextField(blank=True, help_text="Output test case")

    def __str__(self):
        return ("Testcase of " + self.question.question_text)

    def input_path(self):
        return os.path.join(
            os.path.join(TEST_CASE_DIR, "ques{}".format(self.question.pk)),
            "input{}.in".format(self.pk))

    def output_path(self):
        return os.path.join(
            os.path.join(TEST_CASE_DIR, "ques{}".format(self.question.pk)),
            "output{}.out".format(self.pk))

    def save(self, *args, **kwargs):
        super(Testcases, self).save(*args, **kwargs)
        with open(
                os.path.join(
                    os.path.join(TEST_CASE_DIR,
                                 "ques{}".format(self.question.pk)),
                    "input{}.in".format(self.pk)), "w") as f:
            f.write(self.input_test)
            f.close()
        with open(
                os.path.join(
                    os.path.join(TEST_CASE_DIR,
                                 "ques{}".format(self.question.pk)),
                    "output{}.out".format(self.pk)), "w") as f:
            f.write(self.output_test)
            f.close()


class Job(models.Model):
    question = models.ForeignKey(Question,
                                 blank=True,
                                 null=True,
                                 on_delete=models.CASCADE)
    coder = models.ForeignKey(Coder,
                              blank=True,
                              null=True,
                              on_delete=models.CASCADE)
    status = models.TextField(
        blank=True, help_text="Status in json format. Please don't touch it.")
    AC_no = models.IntegerField(
        default=0, help_text="Number of correct answers for this job")
    WA_no = models.IntegerField(
        default=0, help_text="Number of wrong answers for this job")
    job_id = models.CharField(max_length=200,
                              null=True,
                              unique=True,
                              help_text="Celery Job id for the current task")

    def __str__(self):
        return self.question.question_code + " " + self.coder.name


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True,
                                   help_text="Answer field for the questions")


@receiver(pre_delete, sender=Question)
def ques_delete(sender, instance, using, **kwargs):
    rmtree(os.path.join(TEST_CASE_DIR, "ques{}".format(instance.pk)))


@receiver(pre_delete, sender=Testcases)
def testcases_delete(sender, instance, using, **kwargs):
    os.remove(
        os.path.join(
            os.path.join(TEST_CASE_DIR, "ques{}".format(instance.question.pk)),
            "input{}.in".format(instance.pk)))
    os.remove(
        os.path.join(
            os.path.join(TEST_CASE_DIR, "ques{}".format(instance.question.pk)),
            "output{}.out".format(instance.pk)))
