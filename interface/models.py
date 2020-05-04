from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t
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

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True, help_text="Answer field for the questions")

