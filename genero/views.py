from rest_framework import viewsets
from .models import Genero
from .serializers import GeneroSerializer

class GeneroViewSet(viewsets.ModelViewSet):
    queryset = Genero.objects.all()
    serializer_class = GeneroSerializer
