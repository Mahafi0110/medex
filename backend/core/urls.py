from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProductCategoryViewSet,
    ProductViewSet,
    ProductSidebarViewSet,
    ProductHighlightViewSet,
    ServiceViewSet,
    ServicePageViewSet,
    ServicePageSidebarViewSet,
    HomeHeroView,
    AboutSectionView,
    EcosystemPillarViewSet,
    OperatingPillarViewSet,
    VisionMissionView,
    TeamMemberViewSet,
    CompanyStatViewSet,
    ContactMessageViewSet,
    SiteSettingsView,
    PageIntroViewSet,
    AboutPageContentView,
    OfficeLocationViewSet,
    ContactPageContentView,
    HealthView,
)

router = DefaultRouter()
router.register("categories", ProductCategoryViewSet, basename="category")
router.register("products", ProductViewSet, basename="product")
router.register("product-sidebar", ProductSidebarViewSet, basename="product-sidebar")
router.register("product-highlights", ProductHighlightViewSet, basename="product-highlight")
router.register("services", ServiceViewSet, basename="service")
router.register("service-pages", ServicePageViewSet, basename="service-page")
router.register("service-page-sidebar", ServicePageSidebarViewSet, basename="service-page-sidebar")
router.register("ecosystem-pillars", EcosystemPillarViewSet, basename="ecosystem-pillar")
router.register("operating-pillars", OperatingPillarViewSet, basename="operating-pillar")
router.register("team", TeamMemberViewSet, basename="team")
router.register("stats", CompanyStatViewSet, basename="stat")
router.register("contact", ContactMessageViewSet, basename="contact")
router.register("page-intros", PageIntroViewSet, basename="page-intro")
router.register("office-locations", OfficeLocationViewSet, basename="office-location")

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("home-hero/", HomeHeroView.as_view(), name="home-hero"),
    path("about-section/", AboutSectionView.as_view(), name="about-section"),
    path("vision-mission/", VisionMissionView.as_view(), name="vision-mission"),
    path("site-settings/", SiteSettingsView.as_view(), name="site-settings"),
    path("about-page-content/", AboutPageContentView.as_view(), name="about-page-content"),
    path("contact-page-content/", ContactPageContentView.as_view(), name="contact-page-content"),
] + router.urls