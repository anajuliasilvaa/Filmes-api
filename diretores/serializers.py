from rest_framework import serializers
from .models import Diretor

class DiretorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diretor
        fields = '__all__'