from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import ListaFavoritos
from .serializers import ListaFavoritosSerializer, AdicionarFilmeSerializer
from filmes.models import Filme
from django.db import IntegrityError

class IsOwnerOrReadOnly(IsAuthenticated):
    """Permite acesso total apenas ao dono do objeto."""
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET']:
            return True
        return obj.usuario == request.user

class ListaFavoritosListCreateView(generics.ListCreateAPIView):
    """GET /api/favoritos/ (Lista) e POST /api/favoritos/ (Cria)"""
    serializer_class = ListaFavoritosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retorna apenas as listas do usuário logado."""
        return ListaFavoritos.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        """Salva a nova lista associada ao usuário logado."""
        serializer.save(usuario=self.request.user)

class ListaFavoritosRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/PATCH/DELETE /api/favoritos/{id}/"""
    queryset = ListaFavoritos.objects.all()
    serializer_class = ListaFavoritosSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'id'

class AdicionarRemoverFilmeView(generics.GenericAPIView):
    """Endpoint para adicionar ou remover um filme de uma lista específica."""
    serializer_class = AdicionarFilmeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, lista_id):
        lista = get_object_or_404(ListaFavoritos, id=lista_id, usuario=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        filme = serializer.validated_data['filme_id']
        
        if filme in lista.filmes.all():
            lista.filmes.remove(filme)
            return Response({'detail': f'Filme "{filme.titulo}" removido da lista "{lista.nome}".'}, status=status.HTTP_200_OK)
        else:
            lista.filmes.add(filme)
            return Response({'detail': f'Filme "{filme.titulo}" adicionado à lista "{lista.nome}".'}, status=status.HTTP_201_CREATED)