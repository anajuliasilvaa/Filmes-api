from django.urls import path
from . import views

app_name = 'favoritos' 

urlpatterns = [
    path('', views.minhas_listas, name='minhas_listas'),
    path('criar/', views.criar_lista, name='criar_lista'),
    path('<int:lista_id>/', views.detalhes_lista, name='detalhes_lista'),
    path('<int:lista_id>/editar/', views.editar_lista, name='editar_lista'),
    path('<int:lista_id>/deletar/', views.deletar_lista, name='deletar_lista'),
    path('adicionar/<int:filme_id>/', views.adicionar_aos_favoritos, name='adicionar_aos_favoritos'),
]