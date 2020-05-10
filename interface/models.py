from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from judge.settings import TEST_CASE_DIR
from shutil import rmtree
import os


class Config(models.Model):
    start_time = models.DateTimeField(
        default=t.now, help_text="Time and Date the contest starts")
    end_time = models.DateTimeField(default=t.now,
                                    help_text="Time and Date the contest ends")

    def __str__(self):
        return "Server wide config for start and end time"


class Question(models.Model):
    question_text = models.TextField(
        blank=True, help_text="The entire text for the question")
    question_image = models.ImageField(
        blank=True, help_text="Optional Image if the question demands")
    input_example = models.TextField(
        blank=True, help_text="Example showing how should the input look")
    output_example = models.TextField(
        blank=True, help_text="Example showing how should the output look")

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
