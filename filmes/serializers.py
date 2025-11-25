from rest_framework import serializers
from .models import Filme

class FilmeSerializer(serializers.ModelSerializer):

    class Meta:
        extra_kwargs = {
            'email': {'write_only': True}
        }

        model = Filme
        fields = [
            'id',
            'titulo',
            'sinopse',
            'ano_publicacao',
            'duracao',
            'poster'
        ]