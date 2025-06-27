from rest_framework.routers import DefaultRouter
from .views import FlockViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'flocks', FlockViewSet, basename='flock')

urlpatterns = [
    path('', include(router.urls)),
] 