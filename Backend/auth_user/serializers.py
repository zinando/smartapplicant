from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'resume_data', 'phone_number', 'date_joined', 'is_active', 'is_staff', 'is_superuser']

