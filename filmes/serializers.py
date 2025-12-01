from rest_framework import serializers
from .models import Filme
from genero.serializers import GeneroSerializer
from diretores.serializers import DiretorSerializer
from avaliacoes.serializers import AvaliacaoSerializer

class FilmeSerializer(serializers.ModelSerializer):
    generos = GeneroSerializer(many=True, read_only=True)
    diretores = DiretorSerializer(many=True, read_only=True)
    avaliacoes = AvaliacaoSerializer(many=True, read_only=True)
    media_avaliacoes = serializers.SerializerMethodField()
    
    # Campos para escrita (IDs)
    generos_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Filme.generos.field.related_model.objects.all(),
        write_only=True,
        source='generos',
        required=False
    )
    diretores_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Filme.diretores.field.related_model.objects.all(),
        write_only=True,
        source='diretores',
        required=False
    )

    class Meta:
        model = Filme
        fields = [
            'id',
            'titulo',
            'sinopse',
            'ano_publicacao',
            'duracao',
            'poster',
            'generos',
            'generos_ids',
            'diretores',
            'diretores_ids',
            'avaliacoes',
            'media_avaliacoes'
        ]
    
    def create(self, validated_data):
        generos = validated_data.pop('generos', [])
        diretores = validated_data.pop('diretores', [])
        
        filme = Filme.objects.create(**validated_data)
        
        if generos:
            filme.generos.set(generos)
        if diretores:
            filme.diretores.set(diretores)
        
        return filme
    
    def update(self, instance, validated_data):
        generos = validated_data.pop('generos', None)
        diretores = validated_data.pop('diretores', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if generos is not None:
            instance.generos.set(generos)
        if diretores is not None:
            instance.diretores.set(diretores)
        
        return instance
    
    def get_media_avaliacoes(self, obj):
        """Calcula a média das avaliações"""
        avaliacoes = obj.avaliacoes.all()
        if avaliacoes.exists():
            total = sum(av.nota for av in avaliacoes)
            return round(total / avaliacoes.count(), 1)
        return None