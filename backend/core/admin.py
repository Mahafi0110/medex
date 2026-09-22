from django.contrib import admin
from django.shortcuts import redirect
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


class ProductScreenshotInline(admin.TabularInline):
    model = ProductScreenshot
    extra = 1


class ProductLinkInline(admin.TabularInline):
    model = ProductLink
    extra = 1


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "product_count")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = "Products"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "product_type", "status", "is_featured", "order")
    list_filter = ("category", "product_type", "status", "is_featured")
    search_fields = ("name", "tagline", "summary")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductScreenshotInline, ProductLinkInline]
    fieldsets = (
        ("Basic info", {
            "fields": ("name", "slug", "category", "product_type", "status", "is_featured", "order")
        }),
        ("Content (Overview tab)", {
            "fields": ("tagline", "summary", "description", "key_features")
        }),
        ("Specifications tab", {
            "fields": ("specifications",),
            "description": "One 'Label: Value' pair per line — rendered as a two-column table.",
        }),
        ("Products-page hero banner (shown when this product is selected)", {
            "fields": (
                "hero_layout",
                "hero_eyebrow", "hero_title", "hero_subtitle",
                "hero_badge_1", "hero_badge_2", "hero_badge_3", "hero_badge_4",
                "hero_tagline", "hero_image",
            ),
            "classes": ("collapse",),
        }),
        ("Sidebar note (optional — leave 'Note title' blank to hide)", {
            "fields": (
                "sidebar_note_title", "sidebar_note_text",
                "sidebar_note_phone", "sidebar_note_email",
                "sidebar_note_cta_label", "sidebar_note_cta_url",
            ),
            "classes": ("collapse",),
        }),
        ("Homepage highlight card (independent of the content above)", {
            "fields": ("highlight_features", "highlight_link_label"),
            "description": "Only used when this product appears in the homepage's 'Products' "
                           "highlight section — separate from what's shown on the full Products page.",
        }),
        ("Media", {
            "fields": ("logo", "cover_image")
        }),
        ("Links", {
            "fields": ("website_url", "app_store_url", "play_store_url", "download_url")
        }),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name", "is_featured", "order")
    list_filter = ("is_featured",)
    search_fields = ("name", "summary")
    prepopulated_fields = {"slug": ("name",)}


class ServiceFeatureItemInline(admin.TabularInline):
    model = ServiceFeatureItem
    extra = 1
    fields = ("icon", "title", "image", "tag_label", "focus_text", "background_text", "apply_url", "order")


class ServiceProcessStepInline(admin.TabularInline):
    model = ServiceProcessStep
    extra = 1


class ServiceEquipmentItemInline(admin.TabularInline):
    model = ServiceEquipmentItem
    extra = 1


class ServiceValueItemInline(admin.TabularInline):
    model = ServiceValueItem
    extra = 1


class ServiceGalleryImageInline(admin.TabularInline):
    model = ServiceGalleryImage
    extra = 1


@admin.register(ServicePage)
class ServicePageAdmin(admin.ModelAdmin):
    list_display = ("nav_label", "order", "form_type")
    prepopulated_fields = {"slug": ("nav_label",)}
    inlines = [
        ServiceFeatureItemInline,
        ServiceProcessStepInline,
        ServiceEquipmentItemInline,
        ServiceValueItemInline,
        ServiceGalleryImageInline,
    ]
    fieldsets = (
        ("Tab", {"fields": ("nav_label", "slug", "nav_icon", "order")}),
        ("Hero", {
            "fields": (
                "hero_eyebrow", "hero_title_main", "hero_title_highlight", "hero_subtitle",
                "hero_badge_1_icon", "hero_badge_1_text",
                "hero_badge_2_icon", "hero_badge_2_text",
                "hero_badge_3_icon", "hero_badge_3_text",
                "hero_badge_4_icon", "hero_badge_4_text",
                "hero_cta_label", "hero_tagline", "hero_image",
            ),
        }),
        ("Overview (main feature grid below the tab bar)", {
            "fields": ("overview_eyebrow", "overview_title", "overview_subtitle", "overview_description"),
        }),
        ("Process timeline", {"fields": ("process_title", "process_subtitle")}),
        ("Equipment grid (optional)", {"fields": ("equipment_title", "equipment_subtitle")}),
        ("Secondary grid (optional, e.g. 'Why Work With Us?')", {
            "fields": ("secondary_eyebrow", "secondary_title", "secondary_subtitle"),
        }),
        ("Photo gallery (optional, e.g. 'Life at MedEx')", {
            "fields": ("gallery_title", "gallery_subtitle"),
        }),
        ("CTA banner", {
            "fields": ("cta_icon", "cta_title", "cta_subtitle", "cta_image", "cta_button_label", "cta_button_url"),
            "description": "Leave 'CTA button label' blank for the default Call Now/WhatsApp banner. "
                           "Fill it in (e.g. 'Request Training') for a single-button banner with the photo above as its background.",
        }),
        ("Enquiry form", {"fields": ("form_title", "form_description", "form_type")}),
    )


class HomeTrustPointInline(admin.TabularInline):
    model = HomeTrustPoint
    extra = 1


@admin.register(HomeHero)
class HomeHeroAdmin(admin.ModelAdmin):
    """Singleton admin: only one Home Hero Banner row can ever exist."""

    inlines = [HomeTrustPointInline]
    fieldsets = (
        ("Text", {"fields": ("eyebrow", "title_main", "title_highlight", "subtitle")}),
        ("Background", {"fields": ("background_image",)}),
        ("Buttons", {
            "fields": ("primary_button_label", "primary_button_url", "secondary_button_label", "secondary_button_url"),
        }),
    )

    def has_add_permission(self, request):
        return not HomeHero.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = HomeHero.load()
        return redirect("admin:core_homehero_change", obj.pk)


@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    """Singleton admin: only one 'Who We Are' row can ever exist."""

    fieldsets = (
        ("Text", {"fields": ("eyebrow", "title", "paragraph_1", "paragraph_2")}),
        ("Image", {"fields": ("image",)}),
        ("Floating credential badge", {"fields": ("badge_icon", "badge_title", "badge_subtitle")}),
    )

    def has_add_permission(self, request):
        return not AboutSection.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # Skip the list page entirely — go straight to editing the one row.
        obj = AboutSection.load()
        from django.shortcuts import redirect
        return redirect("admin:core_aboutsection_change", obj.pk)


@admin.register(EcosystemPillar)
class EcosystemPillarAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "order")
    ordering = ("order",)


@admin.register(OperatingPillar)
class OperatingPillarAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "order")
    ordering = ("order",)


class VisionHighlightInline(admin.TabularInline):
    model = VisionHighlight
    extra = 1


class VisionStatusRowInline(admin.TabularInline):
    model = VisionStatusRow
    extra = 1


class MissionPillarInline(admin.TabularInline):
    model = MissionPillar
    extra = 1


@admin.register(VisionMission)
class VisionMissionAdmin(admin.ModelAdmin):
    """Singleton admin: only one Vision & Mission row can ever exist."""

    inlines = [VisionHighlightInline, VisionStatusRowInline, MissionPillarInline]
    fieldsets = (
        ("Vision", {"fields": ("vision_title", "vision_text")}),
        ("Mission", {"fields": ("mission_title", "mission_text")}),
        ("'Live Asset Network Status' dashboard mock (shown beside Vision)", {
            "fields": (
                "network_panel_title", "network_panel_status_label", "network_panel_quote",
                "network_benchmark_title", "network_benchmark_subtitle", "network_benchmark_tag",
            ),
            "classes": ("collapse",),
        }),
        ("'The MedEx Biomed Ecosystem' diagram (shown beside Mission)", {
            "fields": (
                "ecosystem_eyebrow", "ecosystem_title", "ecosystem_subtitle",
                "ecosystem_core_label", "ecosystem_core_title", "ecosystem_core_subtitle",
                "ecosystem_footer_badge_1", "ecosystem_footer_badge_2",
            ),
            "description": "The 3 satellite boxes in this diagram are pulled from Ecosystem Pillars "
                           "(the same content shown on the homepage) — manage those separately.",
            "classes": ("collapse",),
        }),
    )

    def has_add_permission(self, request):
        return not VisionMission.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = VisionMission.load()
        return redirect("admin:core_visionmission_change", obj.pk)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "is_leadership", "order")
    list_filter = ("is_leadership",)
    ordering = ("order",)
    fieldsets = (
        ("Basic info", {"fields": ("name", "role", "title", "photo", "bio", "order")}),
        ("About page leadership profile", {
            "fields": ("prior_leadership", "domain_expertise", "operational_base"),
        }),
        ("Homepage 'Our Leadership' section & pull-quote", {
            "fields": ("is_leadership", "quote", "quote_label", "badge_text", "years_text"),
        }),
    )


@admin.register(CompanyStat)
class CompanyStatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "icon", "order")
    ordering = ("order",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "interested_in", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = (
        "name", "email", "phone", "organization", "subject",
        "interested_in", "additional_info", "message", "resume", "created_at",
    )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Singleton admin: site-wide logo, name, and contact info."""

    fieldsets = (
        ("Identity", {"fields": ("site_name", "logo", "footer_tagline")}),
        ("Contact info", {"fields": ("address", "phone", "whatsapp_number", "email", "business_hours")}),
        ("Social links", {"fields": ("facebook_url", "instagram_url", "linkedin_url", "youtube_url")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = SiteSettings.load()
        return redirect("admin:core_sitesettings_change", obj.pk)


@admin.register(PageIntro)
class PageIntroAdmin(admin.ModelAdmin):
    list_display = ("page", "title")
    fieldsets = (
        ("Page", {"fields": ("page",)}),
        ("Hero", {"fields": ("eyebrow", "title", "title_highlight", "description", "image")}),
        ("Bottom CTA banner (optional)", {"fields": ("cta_title", "cta_text")}),
    )


class WhyChooseUsItemInline(admin.TabularInline):
    model = WhyChooseUsItem
    extra = 1


@admin.register(AboutPageContent)
class AboutPageContentAdmin(admin.ModelAdmin):
    """Singleton admin: About Us page's Story/Leadership-header/Why-Choose-Us content."""

    inlines = [WhyChooseUsItemInline]
    fieldsets = (
        ("Hero decorations (title/subtitle come from Page Intros → About)", {
            "fields": ("hero_badge_title", "hero_highlight_value", "hero_highlight_label", "hero_status_text"),
        }),
        ("Our Story", {
            "fields": (
                "story_eyebrow", "story_title", "story_paragraph_1", "story_paragraph_2", "story_quote",
                "story_image", "story_image_badge", "story_caption_eyebrow", "story_caption_text",
            ),
        }),
        ("About Director & Founder (section header only — edit the person under Team Members)", {
            "fields": ("leadership_eyebrow", "leadership_title"),
        }),
        ("Why Choose Us", {
            "fields": ("why_choose_eyebrow", "why_choose_title_main", "why_choose_title_highlight", "why_choose_description"),
        }),
    )

    def has_add_permission(self, request):
        return not AboutPageContent.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = AboutPageContent.load()
        return redirect("admin:core_aboutpagecontent_change", obj.pk)


@admin.register(OfficeLocation)
class OfficeLocationAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "order")
    ordering = ("order",)


class ContactHighlightInline(admin.TabularInline):
    model = ContactHighlight
    extra = 1


@admin.register(ContactPageContent)
class ContactPageContentAdmin(admin.ModelAdmin):
    """Singleton admin: Contact page's form/details-card/map-section copy."""

    inlines = [ContactHighlightInline]
    fieldsets = (
        ("Enquiry form", {"fields": ("form_title", "form_description")}),
        ("Contact details card", {"fields": ("details_eyebrow", "details_title", "details_subtitle", "highlights_intro")}),
        ("Map section", {"fields": ("map_eyebrow", "map_title", "map_description")}),
    )

    def has_add_permission(self, request):
        return not ContactPageContent.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = ContactPageContent.load()
        return redirect("admin:core_contactpagecontent_change", obj.pk)