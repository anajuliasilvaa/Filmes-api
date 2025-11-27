from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from filmes.urls import router
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from genero.urls import router as genero_router
from avaliacoes.urls import router as avaliacoes_router

urlpatterns = [
    path('admin/', admin.site.urls),

    # APIs do seu sistema de filmes
    path('api/v1/', include('filmes.urls')),
    path('api/v2/', include(router.urls)),
    path('api/v1/', include(genero_router.urls)),
    path('api/v1/', include(avaliacoes_router.urls)),

    # Autenticação do DRF (opcional)
    path('auth/', include('rest_framework.urls')),

    # API de usuários (registro, perfil, avatar, logout)
    path('api/user/', include('usuarios.urls')),

    # JWT
    path('api/login/', TokenObtainPairView.as_view()),      # recebe email/senha
    path('api/refresh/', TokenRefreshView.as_view()),        # renova access token
    path('api/logout/', TokenBlacklistView.as_view()),       # invalida refresh token
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
