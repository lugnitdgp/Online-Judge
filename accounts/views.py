from django.shortcuts import render
from google.oauth2 import id_token
from google.auth.transport import requests
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import viewsets, generics, authentication, permissions
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes, APIView, api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.models import Coder
from django.contrib.auth.models import User
from accounts.serializers import *
from decouple import config
import requests as r
from knox.models import AuthToken


def verifyUser(email):
    try:
        Coder.objects.get(email=email)
        return True
    except ObjectDoesNotExist:
        return False

def verifyPassword(email, password):
    try:
        c = User.objects.get(email=email)
        return c.check_password(password)
    except:
        return False 

def verifyGoogleToken(token):
    CLIENT_ID = config('GOOGLE_CLIENT_ID', cast=str)
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(),
                                              CLIENT_ID)

        if id_info['iss'] not in [
                'accounts.google.com', 'https://accounts.google.com'
        ]:
            raise ValueError('Wrong Issuer')

        return {
            "email": id_info['email'],
            "username": id_info['email'],
            "first_name": id_info['name'],
            "image": id_info['picture'],
            "status": 200
        }
    except ValueError:
        return {
            'status': 404,
            'message': 'Your Token has expired. Please login again!'
        }


def verifyFacebookToken(accesstoken, userID):
    url = "https://graph.facebook.com/{}".format(userID)
    parameters = {'fields': 'name,email,picture', 'access_token': accesstoken}
    idInfo = r.get(url=url, params=parameters).json()
    return {
        "email": idInfo['email'],
        "username": idInfo['email'],
        "first_name": idInfo['name'],
        "image": idInfo['picture']['data']['url'],
        'status': 200
    }


@permission_classes([
    AllowAny,
])
class Register(generics.GenericAPIView):
    serializer, user = None, None
    serializer_class = RegisterSerializer

    # @api_view(['POST'])
    def post(self, request, *args, **kwargs):
        res = customRegister(request)
        if res['status'] == 404:
                return Response({'status': 404, 'message': 'Token expired'})
        else:
            if verifyUser(res['email']) == False:
                self.serializer = self.get_serializer(data=res)
                self.serializer.is_valid(raise_exception=True)
                self.user = self.serializer.save()
                Coder.objects.create(user=self.user,
                                        name=res['username'],
                                        first_name=res['first_name'],
                                        email=res['email'],
                                        image_link=res['image'])
            else:
                return Response({
                    "status": 401,
                    "message": "User has already registered under this email."
                })

        return Response({
            "user": self.serializer.data,
            "token": AuthToken.objects.create(self.user)[1],
            "status": 200
        })


def customRegister(request):
    try:
        res = {
            "email": request.data['email'],
            "username": request.data['username'],
            "first_name": request.data['first_name'],
            "password": request.data["password"],
            "image": "https://robohash.org/" + request.data['email'],
            "status": 200
        }
    except:
        res = {
            "status": 404
        }
    return res

def customLogin(request):
    try:
        res = {
            "email": request.data['email'],
            "password": request.data["password"],
            "status": 200
        }
    except:
        res = {
            "status": 404
        }
    return res


@permission_classes([
    AllowAny,
])
class CustomLogin(generics.GenericAPIView):
    serializer, user = None, None
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        res = customLogin(request)
        if res['status'] == 404:
            return Response({'status': 404, 'message': 'Token expired'})
        else:
            if verifyUser(res['email']) == False:
                return Response({
                    "status": 401,
                    "message": "User doesn't exist."
                })
            elif verifyPassword(res['email'], res['password']) == True:
                self.serializer_class = CoderSerializer
                self.user = User.objects.get(email=res['email'])
                coder = Coder.objects.get(email=res['email'])
                self.serializer = self.get_serializer(coder)
            else:
                return Response({
                    "status": 401,
                    "message": "Incorrect password"
                })

        return Response({
            "user": self.serializer.data,
            "token": AuthToken.objects.create(self.user)[1],
            "status": 200
        })


@permission_classes([
    AllowAny,
])
class SocialLogin(generics.GenericAPIView):
    serializer, user = None, None
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        if request.data.get('provider') == 'google':
            res = verifyGoogleToken(request.data.get('id_token'))
        else:
            res = verifyFacebookToken(request.data.get('access_token'),
                                      request.data.get('userID'))
        if res['status'] == 404:
            return Response({'status': 404, 'message': 'Token expired'})
        else:
            if verifyUser(res['email']) == False:
                self.serializer = self.get_serializer(data=res)
                self.serializer.is_valid(raise_exception=True)
                self.user = self.serializer.save()
                Coder.objects.create(user=self.user,
                                     name=res['username'],
                                     first_name=res['first_name'],
                                     email=res['email'],
                                     image_link=res['image'])
            else:
                self.serializer_class = CoderSerializer
                self.user = User.objects.get(email=res['email'])
                coder = Coder.objects.get(email=res['email'])
                self.serializer = self.get_serializer(coder)

        return Response({
            "user": self.serializer.data,
            "token": AuthToken.objects.create(self.user)[1],
            "status": 200
        })