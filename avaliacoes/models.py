from django.db import models
from filmes.models import Filme
from django.contrib.auth.models import User

class Avaliacao(models.Model):
    filme = models.ForeignKey(
        Filme, 
        on_delete=models.CASCADE,
        related_name='avaliacoes'
    )
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='avaliacoes'
    )
    nota = models.PositiveIntegerField()  # 1 a 5, por exemplo
    comentario = models.TextField(blank=True, null=True)
    data_avaliacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Avaliação'
        verbose_name_plural = 'Avaliações'
        ordering = ['id']

    def __str__(self):
        return f'{self.usuario} - {self.filme} ({self.nota})'
