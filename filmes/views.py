from rest_framework import generics
from .models import Filme
from .serializers import FilmeSerializer
from rest_framework.generics import get_object_or_404
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework import response
from rest_framework import permissions
from .permissions import SuperUsuario

#API V2
class FilmeViewSet(viewsets.ModelViewSet):
    queryset = Filme.objects.all()
    serializer_class = FilmeSerializer

    #permission_classes = [permissions.DjangoModelPermissions]
    #permission_classes = [SuperUsuario, permissions.DjangoModelPermissions]

