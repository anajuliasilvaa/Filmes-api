from rest_framework import generics
from .models import Filme
from .serializers import FilmeSerializer
from rest_framework.generics import get_object_or_404
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework import response
from rest_framework import permissions
from .permissions import SuperUsuario
from usuarios.permissions import IsAdminOrReadOnly

#API V2
class FilmeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Filmes.
    GET: Qualquer um pode visualizar
    POST/PUT/PATCH/DELETE: Apenas administradores
    """
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer
    permission_classes = [IsAdminOrReadOnly]

