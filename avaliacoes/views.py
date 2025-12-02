from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Avaliacao
from .serializers import AvaliacaoSerializer

class AvaliacaoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Avaliações.
    GET: Qualquer um pode visualizar
    POST/PUT/PATCH/DELETE: Apenas usuários autenticados
    """
    queryset = Avaliacao.objects.all()
    serializer_class = AvaliacaoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


    def perform_create(self, serializer):
        # Pega o usuário do request (quem está logado) e salva na avaliação
        serializer.save(usuario=self.request.user)