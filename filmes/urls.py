from django.urls import path
from .views import FilmeViewSet
from rest_framework.routers import SimpleRouter

router = SimpleRouter()
router.register('filmes', FilmeViewSet)



urlpatterns = [
    
]