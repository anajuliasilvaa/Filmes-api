from rest_framework import viewsets
from .models import Genero
from .serializers import GeneroSerializer
from usuarios.permissions import IsAdminOrReadOnly

class GeneroViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Gêneros.
    GET: Qualquer um pode visualizar
    POST/PUT/PATCH/DELETE: Apenas administradores
    """
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
    permission_classes = [IsAdminOrReadOnly]
