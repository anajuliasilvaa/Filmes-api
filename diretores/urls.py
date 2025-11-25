from django.urls import path
from . import views

app_name = 'diretores'
urlpatterns = [
    path('', views.lista_diretores, name='lista_diretores'),
    path('adicionar/', views.adicionar_diretor, name='adicionar_diretor'),
    path('<int:id>/', views.detalhar_diretor, name='detalhar_diretor'),
    path('<int:id>/editar/', views.editar_diretor, name='editar_diretor'),
    path('<int:id>/deletar/', views.deletar_diretor, name='deletar_diretor'),
]