from rest_framework import serializers
from .models import (
    ProductCategory,
    Product,
    ProductScreenshot,
    HomeHero,
    HomeTrustPoint,
    ProductLink,
    Service,
    ServicePage,
    ServiceFeatureItem,
    ServiceProcessStep,
    ServiceEquipmentItem,
    ServiceValueItem,
    ServiceGalleryImage,
    AboutSection,
    EcosystemPillar,
    OperatingPillar,
    VisionMission,
    VisionHighlight,
    VisionStatusRow,
    MissionPillar,
    TeamMember,
    CompanyStat,
    ContactMessage,
    SiteSettings,
    PageIntro,
    AboutPageContent,
    WhyChooseUsItem,
    OfficeLocation,
    ContactPageContent,
    ContactHighlight,
)


class ProductCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source="products.count", read_only=True)

    class Meta:
        model = ProductCategory
        fields = ["id", "name", "slug", "description", "icon", "order", "product_count"]


class ProductScreenshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductScreenshot
        fields = ["id", "image", "caption", "order"]


class ProductLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLink
        fields = ["id", "label", "url", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the dedicated Products page listing/cards."""

    category = ProductCategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "product_type",
            "tagline", "summary", "logo", "cover_image", "is_featured",
        ]


class ProductHighlightSerializer(serializers.ModelSerializer):
    """
    Homepage-only serializer for the 'Products' highlight section.
    Deliberately separate from ProductListSerializer: this is a standalone
    marketing showcase — it exposes external links (website/app/download)
    for its own buttons and is NOT meant to route into the dedicated
    Products page/detail views.
    """

    highlight_feature_list = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "tagline", "summary",
            "cover_image", "logo", "highlight_feature_list", "highlight_link_label",
            "website_url", "app_store_url", "play_store_url", "download_url",
        ]


class ProductSidebarSerializer(serializers.ModelSerializer):
    """Minimal shape for the persistent 'Our Products' sidebar on the product page."""

    category = ProductCategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category", "product_type", "logo"]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the dedicated product detail page."""

    category = ProductCategorySerializer(read_only=True)
    screenshots = ProductScreenshotSerializer(many=True, read_only=True)
    extra_links = ProductLinkSerializer(many=True, read_only=True)
    key_feature_list = serializers.ListField(child=serializers.CharField(), read_only=True)
    specification_rows = serializers.ListField(read_only=True)
    hero_badges = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "product_type",
            "tagline", "summary", "description", "key_feature_list",
            "specification_rows",
            "logo", "cover_image",
            "hero_layout", "hero_eyebrow", "hero_title", "hero_subtitle", "hero_badges",
            "hero_tagline", "hero_image",
            "sidebar_note_title", "sidebar_note_text", "sidebar_note_phone",
            "sidebar_note_email", "sidebar_note_cta_label", "sidebar_note_cta_url",
            "website_url", "app_store_url", "play_store_url", "download_url",
            "screenshots", "extra_links",
            "is_featured", "created_at", "updated_at",
        ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id", "name", "slug", "icon", "summary", "description",
            "image", "is_featured", "order",
        ]


class ServicePageSidebarSerializer(serializers.ModelSerializer):
    """Minimal shape for the tab bar shown across all Services page tabs."""

    class Meta:
        model = ServicePage
        fields = ["id", "nav_label", "nav_icon", "slug", "order"]


class ServiceFeatureItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeatureItem
        fields = [
            "id", "icon", "title", "image",
            "tag_label", "focus_text", "background_text", "apply_url",
            "order",
        ]


class ServiceProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProcessStep
        fields = ["id", "title", "description", "order"]


class ServiceEquipmentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceEquipmentItem
        fields = ["id", "icon", "title", "order"]


class ServiceValueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceValueItem
        fields = ["id", "icon", "title", "description", "order"]


class ServiceGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceGalleryImage
        fields = ["id", "image", "caption", "order"]


class ServicePageDetailSerializer(serializers.ModelSerializer):
    feature_items = ServiceFeatureItemSerializer(many=True, read_only=True)
    process_steps = ServiceProcessStepSerializer(many=True, read_only=True)
    equipment_items = ServiceEquipmentItemSerializer(many=True, read_only=True)
    value_items = ServiceValueItemSerializer(many=True, read_only=True)
    gallery_images = ServiceGalleryImageSerializer(many=True, read_only=True)
    hero_badges = serializers.ListField(read_only=True)
    hero_tagline_lines = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = ServicePage
        fields = [
            "id", "nav_label", "nav_icon", "slug", "order",
            "hero_eyebrow", "hero_title_main", "hero_title_highlight", "hero_subtitle",
            "hero_badges", "hero_cta_label", "hero_tagline_lines", "hero_image",
            "overview_eyebrow", "overview_title", "overview_subtitle", "overview_description",
            "process_title", "process_subtitle",
            "equipment_title", "equipment_subtitle",
            "secondary_eyebrow", "secondary_title", "secondary_subtitle",
            "gallery_title", "gallery_subtitle",
            "cta_icon", "cta_title", "cta_subtitle", "cta_image", "cta_button_label", "cta_button_url",
            "form_title", "form_description", "form_type",
            "feature_items", "process_steps", "equipment_items", "value_items", "gallery_images",
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    bio_paragraphs = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = TeamMember
        fields = [
            "id", "name", "role", "title", "photo", "bio", "bio_paragraphs",
            "quote", "quote_label", "badge_text", "years_text",
            "prior_leadership", "domain_expertise", "operational_base",
            "is_leadership", "order",
        ]


class CompanyStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyStat
        fields = ["id", "label", "value", "icon", "order"]


class HomeTrustPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeTrustPoint
        fields = ["id", "icon", "label", "order"]


class HomeHeroSerializer(serializers.ModelSerializer):
    trust_points = HomeTrustPointSerializer(many=True, read_only=True)

    class Meta:
        model = HomeHero
        fields = [
            "eyebrow", "title_main", "title_highlight", "subtitle", "background_image",
            "primary_button_label", "primary_button_url",
            "secondary_button_label", "secondary_button_url",
            "trust_points",
        ]


class AboutSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutSection
        fields = [
            "eyebrow", "title", "paragraph_1", "paragraph_2", "image",
            "badge_icon", "badge_title", "badge_subtitle",
        ]


class EcosystemPillarSerializer(serializers.ModelSerializer):
    bullet_list = serializers.ListField(child=serializers.CharField(), read_only=True)

    class Meta:
        model = EcosystemPillar
        fields = ["id", "icon", "title", "bullet_list", "link_label", "link_url", "order"]


class OperatingPillarSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatingPillar
        fields = ["id", "icon", "title", "description", "order"]


class VisionHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionHighlight
        fields = ["id", "title", "description", "order"]


class VisionStatusRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisionStatusRow
        fields = ["id", "label", "value", "order"]


class MissionPillarSerializer(serializers.ModelSerializer):
    class Meta:
        model = MissionPillar
        fields = ["id", "title", "description", "order"]


class VisionMissionSerializer(serializers.ModelSerializer):
    highlights = VisionHighlightSerializer(many=True, read_only=True)
    status_rows = VisionStatusRowSerializer(many=True, read_only=True)
    mission_pillars = MissionPillarSerializer(many=True, read_only=True)

    class Meta:
        model = VisionMission
        fields = [
            "vision_title", "vision_text", "mission_title", "mission_text",
            "network_panel_title", "network_panel_status_label", "network_panel_quote",
            "network_benchmark_title", "network_benchmark_subtitle", "network_benchmark_tag",
            "ecosystem_eyebrow", "ecosystem_title", "ecosystem_subtitle",
            "ecosystem_core_label", "ecosystem_core_title", "ecosystem_core_subtitle",
            "ecosystem_footer_badge_1", "ecosystem_footer_badge_2",
            "highlights", "status_rows", "mission_pillars",
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id", "name", "email", "phone", "organization",
            "subject", "interested_in", "additional_info", "resume", "message", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {"message": {"required": False, "allow_blank": True}}


class SiteSettingsSerializer(serializers.ModelSerializer):
    whatsapp_link = serializers.CharField(read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "logo", "footer_tagline",
            "address", "phone", "whatsapp_number", "whatsapp_link", "email", "business_hours",
            "facebook_url", "instagram_url", "linkedin_url", "youtube_url",
        ]


class PageIntroSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageIntro
        fields = ["page", "eyebrow", "title", "title_highlight", "description", "image", "cta_title", "cta_text"]


class WhyChooseUsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyChooseUsItem
        fields = ["id", "icon", "title", "description", "order"]


class AboutPageContentSerializer(serializers.ModelSerializer):
    why_choose_items = WhyChooseUsItemSerializer(many=True, read_only=True)

    class Meta:
        model = AboutPageContent
        fields = [
            "hero_badge_title", "hero_highlight_value", "hero_highlight_label", "hero_status_text",
            "story_eyebrow", "story_title", "story_paragraph_1", "story_paragraph_2", "story_quote",
            "story_image", "story_image_badge", "story_caption_eyebrow", "story_caption_text",
            "leadership_eyebrow", "leadership_title",
            "why_choose_eyebrow", "why_choose_title_main", "why_choose_title_highlight", "why_choose_description",
            "why_choose_items",
        ]


class OfficeLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficeLocation
        fields = ["id", "name", "address", "phone", "map_embed_url", "order"]


class ContactHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactHighlight
        fields = ["id", "text", "order"]


class ContactPageContentSerializer(serializers.ModelSerializer):
    highlights = ContactHighlightSerializer(many=True, read_only=True)

    class Meta:
        model = ContactPageContent
        fields = [
            "form_title", "form_description",
            "details_eyebrow", "details_title", "details_subtitle", "highlights_intro",
            "map_eyebrow", "map_title", "map_description",
            "highlights",
        ]