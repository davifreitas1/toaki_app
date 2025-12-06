from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('api/login/', views.login_view, name='api_login'),
    path('api/logout/', views.logout_view, name='api_logout'),
    path('api/check-auth/', views.check_auth_view, name='api_check_auth'),
]