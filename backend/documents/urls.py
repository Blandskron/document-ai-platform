from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import DocumentListView, DocumentUploadView, DocumentSearchAI

urlpatterns = [
    path("list/", DocumentListView.as_view(), name="document-list"),
    path("upload/", DocumentUploadView.as_view(), name="document-upload"),
    path("search/", DocumentSearchAI.as_view(), name="document-search"),

    # JWT Auth
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
