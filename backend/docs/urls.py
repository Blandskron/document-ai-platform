from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Esquema base
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    
    # Documentación con Swagger UI
    path("swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    
    # Documentación con Redoc
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
