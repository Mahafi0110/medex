from rest_framework import viewsets, mixins, filters, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.core.files.storage import default_storage
from django.db import connection
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    ProductCategory,
    Product,
    Service,
    HomeHero,
    ServicePage,
    AboutSection,
    EcosystemPillar,
    OperatingPillar,
    VisionMission,
    TeamMember,
    CompanyStat,
    ContactMessage,
    SiteSettings,
    PageIntro,
    AboutPageContent,
    OfficeLocation,
    ContactPageContent,
)
from .serializers import (
    ProductCategorySerializer,
    ProductListSerializer,
    ProductHighlightSerializer,
    HomeHeroSerializer,
    ProductSidebarSerializer,
    ProductDetailSerializer,
    ServiceSerializer,
    ServicePageSidebarSerializer,
    ServicePageDetailSerializer,
    AboutSectionSerializer,
    EcosystemPillarSerializer,
    OperatingPillarSerializer,
    VisionMissionSerializer,
    TeamMemberSerializer,
    CompanyStatSerializer,
    ContactMessageSerializer,
    SiteSettingsSerializer,
    PageIntroSerializer,
    AboutPageContentSerializer,
    OfficeLocationSerializer,
    ContactPageContentSerializer,
)

from .emails import send_contact_notification
from .throttles import ContactRateThrottle


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    lookup_field = "slug"


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Dedicated Products page.
    /api/v1/products/                -> list (filter by ?category__slug= or ?product_type=)
    /api/v1/products/<slug>/         -> detail
    """
    queryset = Product.objects.filter(status="published").select_related("category").prefetch_related(
        "screenshots", "extra_links"
    )
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {
        "category__slug": ["exact"],
        "product_type": ["exact"],
        "is_featured": ["exact"],
    }
    search_fields = ["name", "tagline", "summary"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer


class ProductSidebarViewSet(viewsets.ReadOnlyModelViewSet):
    """
    All published products, minimal fields, for the persistent sidebar shown
    alongside a product's detail page. /api/v1/product-sidebar/
    """
    queryset = Product.objects.filter(status="published").select_related("category")
    serializer_class = ProductSidebarSerializer
    pagination_class = None


class ProductHighlightViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Homepage-only 'Products' section. Separate endpoint from ProductViewSet
    so the homepage's curated highlight cards never get conflated with the
    dedicated Products page listing.
    /api/v1/product-highlights/
    """
    queryset = Product.objects.filter(status="published", is_featured=True).select_related("category")
    serializer_class = ProductHighlightSerializer
    pagination_class = None


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = "slug"


class ServicePageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Dedicated Services page (tabbed).
    /api/v1/service-pages/          -> full list, each with all tab content
    /api/v1/service-pages/<slug>/   -> single tab
    """
    queryset = ServicePage.objects.all().prefetch_related(
        "feature_items", "process_steps", "equipment_items"
    )
    serializer_class = ServicePageDetailSerializer
    lookup_field = "slug"
    pagination_class = None


class ServicePageSidebarViewSet(viewsets.ReadOnlyModelViewSet):
    """All tabs, minimal fields, for the persistent tab bar. /api/v1/service-page-sidebar/"""
    queryset = ServicePage.objects.all()
    serializer_class = ServicePageSidebarSerializer
    pagination_class = None


class HomeHeroView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/home-hero/ — homepage hero banner content."""
    serializer_class = HomeHeroSerializer

    def get_object(self):
        return HomeHero.load()


class AboutSectionView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/about-section/ — homepage 'Who We Are' content."""
    serializer_class = AboutSectionSerializer

    def get_object(self):
        return AboutSection.load()


class EcosystemPillarViewSet(viewsets.ReadOnlyModelViewSet):
    """Homepage-only: /api/v1/ecosystem-pillars/"""
    queryset = EcosystemPillar.objects.all()
    serializer_class = EcosystemPillarSerializer
    pagination_class = None


class OperatingPillarViewSet(viewsets.ReadOnlyModelViewSet):
    """Homepage-only: /api/v1/operating-pillars/"""
    queryset = OperatingPillar.objects.all()
    serializer_class = OperatingPillarSerializer
    pagination_class = None


class VisionMissionView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/vision-mission/"""
    serializer_class = VisionMissionSerializer

    def get_object(self):
        return VisionMission.load()


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["is_leadership"]


class CompanyStatViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CompanyStat.objects.all()
    serializer_class = CompanyStatSerializer
    pagination_class = None


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Public write-only endpoint: the contact form(s) POST here."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    # The only row-creating endpoint in the API, so the only one that needs a
    # spam limit (per IP, see core/throttles.py).
    throttle_classes = [ContactRateThrottle]

    def perform_create(self, serializer):
        # Store first, then notify: a mail failure must never lose the enquiry.
        # send_contact_notification() catches and logs its own errors.
        submission = serializer.save()
        send_contact_notification(submission)


class SiteSettingsView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/site-settings/ — logo, name, address, phone, email, hours, socials."""
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


class PageIntroViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Per-page hero/CTA copy for the static pages.
    /api/v1/page-intros/            -> all pages
    /api/v1/page-intros/<page>/     -> lookup by page key, e.g. 'about'
    """
    queryset = PageIntro.objects.all()
    serializer_class = PageIntroSerializer
    lookup_field = "page"
    pagination_class = None


class AboutPageContentView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/about-page-content/ — About Us page's Mission/Approach text."""
    serializer_class = AboutPageContentSerializer

    def get_object(self):
        return AboutPageContent.load()


class OfficeLocationViewSet(viewsets.ReadOnlyModelViewSet):
    """All office locations for the Contact page's map tabs. /api/v1/office-locations/"""
    queryset = OfficeLocation.objects.all()
    serializer_class = OfficeLocationSerializer
    pagination_class = None


class ContactPageContentView(generics.RetrieveAPIView):
    """Singleton: GET /api/v1/contact-page-content/ — Contact page's form/details/map copy."""
    serializer_class = ContactPageContentSerializer

    def get_object(self):
        return ContactPageContent.load()


class HealthView(APIView):
    """
    GET /api/v1/health/ — deployment sanity check.

    Answers, from outside Render, the two questions that matter when content
    looks wrong on a deployed site: which database the backend is actually
    talking to, and how much content is in it. If `database` reads "sqlite" on
    a deployed service, that database lives on an ephemeral disk and every
    deploy/restart wipes it.
    """

    def get(self, request):
        try:
            connection.ensure_connection()
        except Exception as exc:  # noqa: BLE001 — report the error, never 500
            return Response(
                {
                    "status": "error",
                    "database": connection.vendor,
                    "database_error": str(exc),
                    "content_counts": {},
                }
            )

        counts = {}
        for label, model in (
            ("products", Product),
            ("product_categories", ProductCategory),
            ("services", Service),
            ("service_pages", ServicePage),
            ("page_intros", PageIntro),
            ("team_members", TeamMember),
            ("company_stats", CompanyStat),
            ("contact_messages", ContactMessage),
        ):
            try:
                counts[label] = model.objects.count()
            except Exception:  # noqa: BLE001 — a missing table must not 500
                counts[label] = None

        payload = {
            "status": "ok",
            "database": connection.vendor,
            "media_storage": type(default_storage).__name__,
            "media_served_by_django": getattr(settings, "SERVE_MEDIA", False),
            "content_counts": counts,
        }
        if connection.vendor == "sqlite":
            payload["warning"] = (
                "SQLite is in use. On Render the filesystem is ephemeral, so all "
                "content is wiped on every deploy/restart. Set USE_POSTGRES=True "
                "plus DB_NAME, DB_USER, DB_PASSWORD, DB_HOST and DB_PORT."
            )
        return Response(payload)