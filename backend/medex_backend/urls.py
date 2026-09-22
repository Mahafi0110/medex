from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

# Branding for the admin site (this is the client's CMS)
admin.site.site_header = "MedEX Administration"
admin.site.site_title = "MedEX Admin"
admin.site.index_title = "Website Content Management"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("core.urls")),
]

# Uploaded images (product covers, logos, hero photos, team photos...).
# Django's own static() helper returns [] as soon as DEBUG=False, and WhiteNoise
# only serves files collected into STATIC_ROOT — so this explicit route is what
# makes Django-Admin uploads visible on the deployed site.
if settings.SERVE_MEDIA:
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]

