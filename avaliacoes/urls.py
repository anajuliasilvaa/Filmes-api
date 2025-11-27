from rest_framework.routers import SimpleRouter
from .views import AvaliacaoViewSet

router = SimpleRouter()
router.register('avaliacoes', AvaliacaoViewSet)

urlpatterns = []
