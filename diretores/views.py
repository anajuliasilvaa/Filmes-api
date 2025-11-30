from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from .models import Diretor
from .serializers import DiretorSerializer

class DiretorViewSet(viewsets.ModelViewSet):
    """
    API endpoint que permite que diretores sejam vistos ou editados.
    GET /api/diretores/ -> Lista todos (Permissão: Qualquer um)
    POST /api/diretores/ -> Cria novo (Permissão: Admin)
    PUT/PATCH/DELETE /api/diretores/{id}/ -> Edita/Deleta (Permissão: Admin)
    """
    queryset = Diretor.objects.all().order_by('nome')
    serializer_class = DiretorSerializer

    def get_permissions(self):
        """
        Define as permissões de acordo com o tipo de requisição (método HTTP).
        - POST, PUT, PATCH, DELETE: Requer admin.
        - GET (listagem e detalhes): Permite qualquer um (AllowAny).
        """
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAdminUser]
        else:
            self.permission_classes = [AllowAny]
        
        return [permission() for permission in self.permission_classes]