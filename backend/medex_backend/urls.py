from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Branding for the admin site (this is the client's CMS)
admin.site.site_header = "MedEX Administration"
admin.site.site_title = "MedEX Admin"
admin.site.index_title = "Website Content Management"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
