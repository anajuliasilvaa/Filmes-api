from rest_framework import serializers
from .models import Avaliacao

class AvaliacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'filme',
            'usuario',
            'nota',
            'comentario',
            'data_avaliacao'
        ]
