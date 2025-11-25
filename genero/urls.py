from django.urls import path
from . import views

urlpatterns = [
    path('', views.listar_generos, name='listar_generos'),
    path('novo/', views.criar_genero, name='criar_genero'),
    path('editar/<int:pk>/', views.editar_genero, name='editar_genero'),
    path('deletar/<int:pk>/', views.deletar_genero, name='deletar_genero'),
]
