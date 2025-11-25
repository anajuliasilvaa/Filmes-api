from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    avatar_name = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f'Profile de {self.user.username}'

