from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User
from .serializer import RegisterSerializer, UserSerializer, ProfileSerializer
from .permissions import IsAdminUserGroup, IsGeneralOrAdmin
from .disney_service import DisneyAPIService


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout realizado com sucesso!"})
    except Exception:
        return Response({"error": "Token inválido ou ausente."}, status=400)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Perfil atualizado!"})
        return Response(serializer.errors, status=400)


class UserListView(generics.ListCreateAPIView):
    """
    Lista e cria usuários.
    GET: Apenas administradores podem listar usuários
    POST: Apenas administradores podem criar usuários (registro público usa RegisterView)
    """
    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserGroup]

class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Visualiza, atualiza e deleta usuários específicos.
    Apenas administradores podem acessar.
    """
    queryset = User.objects.all().select_related('profile')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserGroup]
    


# AS CLASSES UserDetailView, UserUpdateView e UserDeleteView FORAM REMOVIDAS


class AvatarListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        page = int(request.GET.get("page", 1))
        search = request.GET.get("search")

        if search:
            data = DisneyAPIService.search_characters(search)
            return Response({"data": data})

        data = DisneyAPIService.get_characters_page(page, 21)
        return Response(data)

    def post(self, request):
        profile = request.user.profile
        profile.avatar_url = request.data.get("avatar_url")
        profile.avatar_name = request.data.get("avatar_name")
        profile.save()

        return Response({"detail": "Avatar atualizado!"})


class AvatarRandomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        disney = DisneyAPIService.get_random_character()
        if not disney:
            return Response({"error": "Erro ao obter avatar"}, status=400)

        profile = request.user.profile
        profile.avatar_url = disney.get("imageUrl")
        profile.avatar_name = disney.get("name")
        profile.save()

        return Response({"detail": "Avatar aleatório atribuído!"})