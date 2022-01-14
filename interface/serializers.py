from rest_framework import serializers
from interface.models import Question, Contest, Job, Answer, Editorial, Announcements, Rules, Sponsor
import datetime

class QuestionSerializer(serializers.ModelSerializer):
    languages = serializers.SerializerMethodField('get_langs')

    def get_langs(self, obj):
        langs = []
        for each in obj.contest.contest_langs.all():
            langs.append(each.name)
        return langs
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ( 'languages', )


class QuestionListSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        return {
            'question_name': instance.question_name,
            'question_code': instance.question_code,
            'question_score': instance.question_score,
            'editorial' : instance.editorial_published
        }

class ContestSerializer(serializers.ModelSerializer):
    languages = serializers.SerializerMethodField('get_langs')
    templates = serializers.SerializerMethodField('get_templates')
    
    def get_langs(self, obj):
        langs = []
        for each in obj.contest_langs.all():
            langs.append(each.name)
        return langs

    def get_templates(self, obj):
        default_code = []
        for each in obj.contest_langs.all():
            default_code.append(each.template)
        return default_code
            
    class Meta:
        model = Contest
        fields = ('contest_name', 'contest_code', 'start_time', 'end_time', 'contest_image', 'languages', 'templates')

    def to_representation(self, instance):
        data = super(ContestSerializer, self).to_representation(instance)
        data['prize_link'] = instance.prize_form
        data['start_time'] = instance.start_time.timestamp()
        data['end_time'] = instance.end_time.timestamp()
        data['contest_image'] = self.context['request'].build_absolute_uri(instance.contest_image.url)
        return data


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('contest', 'question_name', 'name', 'code', 'lang', 'coder', 'status', 'AC_no', 'WA_no', 'timestamp')


class PersonalSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('contest', 'question_name', 'name', 'code', 'lang', 'coder', 'status', 'AC_no', 'WA_no',
                  'timestamp')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('ques_name', 'correct', 'wrong', 'score', 'timestamp')


class EditorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Editorial
        fields = ('question', 'solution', 'code', 'ques_name')


class AnnouncementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcements
        fields = '__all__'

class RulesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rules
        fields = '__all__'

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'

    def to_representation(self, instance):
        data = super(SponsorSerializer, self).to_representation(instance)
        data['logo'] = self.context['request'].build_absolute_uri(instance.logo.url)
        return data
