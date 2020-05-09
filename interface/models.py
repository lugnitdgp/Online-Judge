from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t

from shutil import rmtree
import os
# Create your models here.

class Config(models.Model):
    start_time = models.DateTimeField(default = t.now, help_text = "Time and Date the contest starts")
    end_time = models.DateTimeField(default = t.now, help_text = "Time and Date the contest ends")

    def __str__(self):
        return "Server wide config for start and end time"

class Question(models.Model):
    question_text = models.TextField(blank=True, help_text="The entire text for the question")
    question_image = models.ImageField(blank=True, help_text="Optional Image if the question demands")
    input_example = models.TextField(blank=True, help_text="Example showing how should the input look")
    output_example = models.TextField(blank=True, help_text="Example showing how should the output look")

    def __str__(self):
            return self.question_text

    def save(self, *args, **kwargs):
        super(Question, self).save(*args, **kwargs)
        os.mkdir("testcases/ques{}".format(self.pk))

    def delete(self, *args, **kwargs):
        rmtree("testcases/ques{}".format(self.pk))
        super(Question, self).delete(*args, **kwargs)

class Testcases(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    input_test = models.TextField(blank=True, help_text="Input test case")
    output_test = models.TextField(blank=True, help_text="Output test case")

    def save(self, *args, **kwargs):
        super(Testcases, self).save(*args, **kwargs)
        with open("testcases/ques{}/input{}.in".format(self.question.pk, self.pk), "w") as f:
            f.write(self.input_test)
            f.close()
        with open("testcases/ques{}/output{}.out".format(self.question.pk, self.pk), "w") as f:
            f.write(self.output_test)
            f.close()

    def delete(self, *args, **kwargs):
        os.remove("testcases/ques{}/input{}.in".format(self.question.pk, self.pk))
        os.remove("testcases/ques{}/output{}.out".format(self.question.pk, self.pk))
        super(Testcases, self).delete(*args, **kwargs)

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True, help_text="Answer field for the questions")

