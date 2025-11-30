from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter 

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from diretores.views import DiretorViewSet
from favoritos.views import AdicionarRemoverFilmeView, ListaFavoritosListCreateView, ListaFavoritosRetrieveUpdateDestroyView

from filmes.urls import router as filmes_router
from genero.urls import router as genero_router
from avaliacoes.urls import router as avaliacoes_router

main_router = DefaultRouter()

main_router.register(r'diretores', DiretorViewSet, basename='diretor')

main_router.registry.extend(filmes_router.registry)
main_router.registry.extend(genero_router.registry)
main_router.registry.extend(avaliacoes_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include(main_router.urls)), 
    
    path('api/v1/favoritos/', include('favoritos.urls', namespace='favoritos')),

    path('auth/', include('rest_framework.urls')),
    

    path('api/user/', include('usuarios.urls')),

    # JWT
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),      
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)