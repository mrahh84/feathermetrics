from rest_framework.routers import DefaultRouter
from .views import FlockViewSet, SaleViewSet, ExpenseViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'flocks', FlockViewSet, basename='flock')
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', include(router.urls)),
] 