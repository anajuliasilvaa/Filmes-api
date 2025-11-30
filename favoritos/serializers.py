from rest_framework import serializers
from filmes.models import Filme 
from .models import ListaFavoritos
from filmes.serializers import FilmeSerializer 

class ListaFavoritosSerializer(serializers.ModelSerializer):
    filmes = FilmeSerializer(many=True, read_only=True)

    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = ListaFavoritos
        fields = ['id', 'nome', 'usuario', 'filmes']

class AdicionarFilmeSerializer(serializers.Serializer):
    """
    Serializer customizado para o endpoint POST de adição.
    Ele recebe apenas o ID do filme a ser adicionado na lista.
    """
    filme_id = serializers.PrimaryKeyRelatedField(
        queryset=Filme.objects.all(),
        label="ID do Filme"
    )