from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from accounts.models import *


class CreateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    first_name = serializers.CharField()

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name')

    def create(self, data):
        user = User.objects.create_user(username=data['username'],
                                        email=data['email'],
                                        first_name=data['first_name'])
        return user

class CoderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coder
        fields = ('name','first_name','email','imageLink','score')