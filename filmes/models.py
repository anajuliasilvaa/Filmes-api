from django.db import models
from genero.models import Genero
from diretores.models import Diretor
from django.db.models import Avg


class Base(models.Model):
    criacao = models.DateTimeField(auto_now_add = True)
    atualizacao = models.DateTimeField(auto_now_add = True)
    ativo = models.BooleanField(default= True)

    class Meta:
        abstract = True


class Filme(models.Model):
    
    titulo = models.CharField(max_length=300)
    sinopse = models.TextField()
    ano_publicacao = models.PositiveIntegerField()
    duracao = models.DurationField(help_text="Formato: hh:mm:ss")
    poster = models.ImageField(upload_to='posters/', null=True, blank=True)
    #generos = models.ManyToManyField(Genero, related_name='filmes')
    #diretores = models.ManyToManyField(Diretor, blank=True)
    

    def media_avaliacoes(self):
        media = self.avaliacoes.aggregate(Avg('nota'))['nota__avg']
        if media is None:
            return 0  # Caso não tenha avaliações
        return round(media, 1)
    
    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = 'Filmes'
        verbose_name_plural = 'filmes'
        ordering = ['id']


