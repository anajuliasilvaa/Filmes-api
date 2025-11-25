from django.db import models
from django.contrib.auth.models import User
from filmes.models import Filme 

class ListaFavoritos(models.Model):
    """Representa uma lista de filmes favoritos criada por um usuário."""
    nome = models.CharField(max_length=200, help_text="Nome da lista (ex: 'Meus Favoritos', 'Melhores de 2024')")

    usuario = models.ForeignKey(User, on_delete=models.CASCADE) 

    filmes = models.ManyToManyField(Filme, blank=True)

    class Meta:
        verbose_name_plural = 'listas de favoritos'
        ordering = ['nome']

    def __str__(self):
        """Retorna a representação em string do modelo."""
        return f"Lista: {self.nome} de {self.usuario.username}"