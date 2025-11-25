from django.urls import path
from .views import (
    RegisterView, ProfileView, AvatarListView, AvatarRandomView,
    logout_api,
    UserListView, UserRetrieveUpdateDestroyView # Importação corrigida
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('logout/', logout_api),

    path('perfil/', ProfileView.as_view()),

    # Avatares
    path('avatar/', AvatarListView.as_view()),
    path('avatar/random/', AvatarRandomView.as_view()),

    # CRUD de usuários (apenas admin)
    path('users/', UserListView.as_view()),                           
    path('users/<int:pk>/', UserRetrieveUpdateDestroyView.as_view()), 
    
 
]