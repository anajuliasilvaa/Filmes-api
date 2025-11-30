from django.urls import path
from .views import ListaFavoritosListCreateView, ListaFavoritosRetrieveUpdateDestroyView, AdicionarRemoverFilmeView

app_name = 'favoritos'

urlpatterns = [
    path('', ListaFavoritosListCreateView.as_view(), name='favoritos-list-create'),
    
    path('<int:id>/', ListaFavoritosRetrieveUpdateDestroyView.as_view(), name='favoritos-detail'),
    
    path('<int:lista_id>/filmes/', AdicionarRemoverFilmeView.as_view(), name='favoritos-add-remove-filme'),
]