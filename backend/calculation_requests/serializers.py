from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Calculation


class UserSerrializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_superuser')


class RequestCreatingSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    positionName = serializers.CharField(max_length=200)
    OCPD2Code = serializers.CharField(max_length=15)
    OKEYCode = serializers.DecimalField(max_digits=3, decimal_places=0)
    unitsCount = serializers.IntegerField()
    workerId = serializers.IntegerField()
    name = serializers.CharField(max_length=150)
    lastDateOfReportProviding = serializers.DateField()


class RequestSerializer(RequestCreatingSerializer):
    created_date = serializers.DateField()


class RequestCalculations(serializers.ModelSerializer):
    class Meta:
        model = Calculation