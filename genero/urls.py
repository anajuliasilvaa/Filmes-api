from rest_framework.routers import SimpleRouter
from .views import GeneroViewSet

router = SimpleRouter()
router.register('generos', GeneroViewSet)

urlpatterns = []
