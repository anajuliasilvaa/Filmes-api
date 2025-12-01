from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.conf import settings
from .serializer import RegisterSerializer, UserSerializer, ProfileSerializer
from .permissions import IsAdminUserGroup, IsGeneralOrAdmin
from .disney_service import DisneyAPIService


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


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


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not old_password or not new_password:
            return Response(
                {"detail": "Senha atual e nova senha são obrigatórias"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not check_password(old_password, user.password):
            return Response(
                {"detail": "Senha atual incorreta"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 6:
            return Response(
                {"detail": "A nova senha deve ter pelo menos 6 caracteres"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Senha alterada com sucesso!"})


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response(
                {"detail": "Email é obrigatório"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
            
            # Tentar enviar email (se falhar, apenas loga o erro)
            try:
                send_mail(
                    'Redefinição de Senha - Catálogo de Filmes',
                    f'Olá {user.username},\n\nVocê solicitou a redefinição de senha.\n\nPara redefinir sua senha, acesse seu perfil e use a opção "Alterar Senha".\n\nSe você não solicitou esta redefinição, ignore este email.\n\nEquipe Catálogo de Filmes',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=True,
                )
            except Exception as e:
                # Se o email falhar, apenas loga mas não quebra a aplicação
                print(f"Erro ao enviar email: {e}")
            
            # Sempre retorna sucesso por segurança
            return Response({"detail": "Instruções enviadas para o email"})
        
        except User.DoesNotExist:
            # Por segurança, não revelar se o email existe ou não
            return Response({"detail": "Instruções enviadas para o email"})
        except Exception as e:
            # Captura qualquer outro erro
            print(f"Erro inesperado: {e}")
            return Response({"detail": "Instruções enviadas para o email"})