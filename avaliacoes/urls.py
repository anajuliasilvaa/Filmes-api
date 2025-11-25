from django.urls import path
from . import views

urlpatterns = [
    path('filme/<int:filme_id>/avaliar/', views.adicionar_avaliacao, name='adicionar_avaliacao'),
    path('avaliacao/<int:avaliacao_id>/editar/', views.editar_avaliacao, name='editar_avaliacao'),
    path('avaliacao/<int:avaliacao_id>/deletar/', views.deletar_avaliacao, name='deletar_avaliacao'),
]
