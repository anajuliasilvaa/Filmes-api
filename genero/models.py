from django.db import models

class Genero(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = 'Gênero'
        verbose_name_plural = 'Gêneros'
        ordering = ['id']

    def __str__(self):
        return self.nome
