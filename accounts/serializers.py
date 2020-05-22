from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
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

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    first_name = serializers.CharField()

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'password')

    def create(self, data):
        user = User.objects.create_user(username=data['username'],
                                        email=data['email'],
                                        first_name=data['first_name'],
                                        password=data['password'])
        return user

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email','password')

class CoderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coder
        fields = ('name','first_name','email','image_link','score','solved_ques')