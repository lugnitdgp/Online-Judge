from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t
# Create your models here.
class Coder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    wrong_answers = models.IntegerField(default=0, help_text="Number of WAs for the user here")
    time_out = models.IntegerField(default=0, help_text="Number of TLEs for the user here")
    score = models.IntegerField(default=0, help_text="Score of the user")
    correct_answers = models.IntegerField(default=0, help_text="Number of correct answers of the user")
    time_stamp = models.DateTimeField(default = t.now, help_text="To check the least time taken for a common score")

    def __str__(self):
        return self.user.username