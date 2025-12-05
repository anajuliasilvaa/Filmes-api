from rest_framework import serializers
from filmes.models import Filme 
from .models import ListaFavoritos
from filmes.serializers import FilmeSerializer 

class ListaFavoritosSerializer(serializers.ModelSerializer):
    filmes = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Filme.objects.all(),
        required=False  # Para permitir atualizar apenas o nome sem enviar filmes
    )
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = ListaFavoritos
        fields = ['id', 'nome', 'usuario', 'filmes']

class AdicionarFilmeSerializer(serializers.Serializer):
    
    filme_id = serializers.PrimaryKeyRelatedField(
        queryset=Filme.objects.all(),
        label="ID do Filme"
    )