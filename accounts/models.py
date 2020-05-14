from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone as t


# Create your models here.
class Coder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50,
                            blank=True,
                            help_text="Name of the user here")
    first_name = models.CharField(max_length=50,
                                  blank=True,
                                  help_text="First name of the user")
    email = models.EmailField(max_length=50, blank=True)
    image_link = models.CharField(max_length=200, blank=True)
    wrong_answers = models.IntegerField(
        default=0, help_text="Number of WAs for the user here")
    time_out = models.IntegerField(
        default=0, help_text="Number of TLEs for the user here")
    score = models.IntegerField(default=0, help_text="Score of the user")
    correct_answers = models.IntegerField(
        default=0, help_text="Number of correct answers of the user")
    solved_ques = models.CharField(max_length=200,
                                   blank=True,
                                   help_text="Questions solved by the user")
    time_stamp = models.DateTimeField(
        default=t.now,
        help_text="To check the least time taken for a common score")

    def __str__(self):
        return self.name

    def get_solved(self):
        if self.solved_ques == '':
            return []
        else:
            return self.solved_ques.split(',')

    def put_solved(self, ques_code):
        solved_arr = self.get_solved()
        solved_arr.append(ques_code)
        self.solved_ques = ",".join(solved_arr)

    def check_solved(self, ques_code):
        solved_arr = self.get_solved()
        for solved in solved_arr:
            if solved == ques_code:
                return True
        return False