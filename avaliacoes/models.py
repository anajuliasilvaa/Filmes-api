from django.db import models
from django.contrib.auth.models import User
from filmes.models import Filme

class Avaliacao(models.Model):
    filme = models.ForeignKey(Filme, on_delete=models.CASCADE, related_name='avaliacoes')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    nota = models.IntegerField(choices=[(i, f"{i} ⭐") for i in range(1, 6)])
    comentario = models.TextField()
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.filme.titulo} ({self.nota}⭐)"
