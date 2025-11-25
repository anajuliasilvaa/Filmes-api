from django.db import models

class Diretor(models.Model):
    nome = models.CharField(max_length=100)
    data_nascimento = models.DateField(blank=True, null=True)
    biografia = models.TextField(blank=True)
    foto = models.ImageField(upload_to='diretores_fotos/', blank=True, null=True)

    class Meta:
        verbose_name_plural = 'diretores'
        ordering = ['nome']

    def __str__(self):
        return self.nome
