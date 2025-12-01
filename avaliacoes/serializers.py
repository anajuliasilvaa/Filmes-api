from rest_framework import serializers
from .models import Avaliacao

class AvaliacaoSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField()
    data_criacao = serializers.DateTimeField(source='data_avaliacao', read_only=True)
    
    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'filme',
            'usuario',
            'nota',
            'comentario',
            'data_avaliacao',
            'data_criacao'
        ]
    
    def get_usuario(self, obj):
        """Retorna informações do usuário"""
        return {
            'id': obj.usuario.id,
            'username': obj.usuario.username
        }
