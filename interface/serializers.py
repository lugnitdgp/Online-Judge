from rest_framework import serializers
from interface.models import Question, Contest, Job, Answer, Editorial


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class QuestionListSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        return {
            'question_name': instance.question_name,
            'question_code': instance.question_code,
            'question_score': instance.question_score
        }

class ContestSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        return {
            'contest_name': instance.contest_name,
            'contest_code': instance.contest_code,
            'start_time': instance.start_time.timestamp(),
            'end_time' : instance.end_time.timestamp(),
            'contest_image' : self.context.get('request').build_absolute_uri(instance.contest_image.url)
        }

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('question','contest','question_name','name','coder','status','AC_no','WA_no', 'timestamp')

class PersonalSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('question','contest','question_name','name','code','lang','coder','status','AC_no','WA_no', 'timestamp')

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('ques_name','correct','wrong','score')

class EditorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Editorial
        fields = ('question','solution','code','ques_name')

