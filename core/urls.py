from django.contrib import admin
from django.urls import path, include
from django.conf import settings               
from django.conf.urls.static import static
from toaki_app.api import api 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('toaki_app.urls')),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)