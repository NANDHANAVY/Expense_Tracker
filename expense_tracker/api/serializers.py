from rest_framework import serializers
from .models import User, Record, Budget
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import User




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email_address', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id','budget','month','year','updated_at']
        read_only_fields = ['updated_at']



# Example serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        user = User.objects.create_user(email=email, password=password)  # Ensure `email` is passed here
        return user
