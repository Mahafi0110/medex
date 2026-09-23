from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SlugMixin(models.Model):
    """Auto-populates a unique slug from `name`/`title` on first save."""

    slug = models.SlugField(max_length=220, unique=True, blank=True)

    class Meta:
        abstract = True

    def _source_field(self):
        return getattr(self, "name", None) or getattr(self, "title", "")

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self._source_field())[:200]
            slug = base
            i = 1
            model = self.__class__
            while model.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                i += 1
                slug = f"{base}-{i}"
            self.slug = slug
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# Products & categories
# ---------------------------------------------------------------------------

class ProductCategory(TimeStampedModel, SlugMixin):
    """e.g. Mobile Applications, Web Applications, Desktop Software, Healthcare Tools"""

    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(
        max_length=50, blank=True,
        help_text="Optional icon identifier used by the frontend (e.g. lucide icon name).",
    )
    order = models.PositiveIntegerField(default=0, help_text="Controls display order on the site.")

    class Meta:
        verbose_name_plural = "Product categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


PRODUCT_TYPE_CHOICES = [
    ("mobile", "Mobile Application"),
    ("web", "Web Application"),
    ("desktop", "Desktop Software"),
    ("device", "Healthcare Device / Tool"),
]

PRODUCT_STATUS_CHOICES = [
    ("draft", "Draft"),
    ("published", "Published"),
    ("archived", "Archived"),
]


class Product(TimeStampedModel, SlugMixin):
    name = models.CharField(max_length=150)
    category = models.ForeignKey(
        ProductCategory, on_delete=models.PROTECT, related_name="products"
    )
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    tagline = models.CharField(
        max_length=200, blank=True, help_text="Short one-line pitch shown on cards."
    )
    summary = models.TextField(help_text="Short description shown on listing/cards.")
    description = models.TextField(
        blank=True, help_text="Full description shown in the Overview tab on the product page.",
    )
    key_features = models.TextField(
        blank=True,
        help_text="One feature per line — rendered as the two-column checklist in the Overview tab.",
    )
    specifications = models.TextField(
        blank=True,
        help_text="One 'Label: Value' pair per line, e.g. 'Platform: iOS & Android (Mobile App)'. "
                   "Rendered as the two-column table in the Specifications tab.",
    )
    cover_image = models.ImageField(upload_to="products/covers/", blank=True, null=True)
    logo = models.ImageField(upload_to="products/logos/", blank=True, null=True)

    # --- Products-page hero banner (shown at the top of the product page for
    # this product; independent per product so 'For Patients' vs 'For
    # Doctors' variants can each have their own messaging) ---
    hero_layout = models.CharField(
        max_length=20,
        choices=[
            ("circular_image", "Circular photo + short tagline (e.g. patient-facing app)"),
            ("dashboard_mockup", "Dark dashboard/window mockup + tagline (e.g. clinician tools)"),
            ("photo_card", "Small photo card + tagline (e.g. simple product)"),
            ("badge_heavy", "No device graphic — larger title + many trust badges (e.g. hardware/devices)"),
        ],
        default="circular_image",
        help_text="Which hero visual style to use for this product.",
    )
    hero_eyebrow = models.CharField(max_length=60, blank=True, default="Our Products")
    hero_title = models.CharField(
        max_length=200, blank=True,
        help_text="e.g. 'Digital Healthcare Solutions for a Healthier Tomorrow'. Falls back to a default if blank.",
    )
    hero_subtitle = models.CharField(max_length=200, blank=True, help_text="e.g. 'Connected Care. Empowered Patients.'")
    hero_badge_1 = models.CharField(max_length=60, blank=True, help_text="e.g. 'Trusted Platform'")
    hero_badge_2 = models.CharField(max_length=60, blank=True, help_text="e.g. 'Patient-Centric'")
    hero_badge_3 = models.CharField(max_length=60, blank=True, help_text="e.g. 'Better Health Outcomes'")
    hero_badge_4 = models.CharField(max_length=60, blank=True, help_text="Optional 4th badge — used by the 'badge_heavy' layout.")
    hero_tagline = models.CharField(
        max_length=150, blank=True,
        help_text="Short line next to the hero device graphic, e.g. 'Your Health In Your Hands Anytime Anywhere'.",
    )
    hero_image = models.ImageField(
        upload_to="products/hero/", blank=True, null=True,
        help_text="Optional photo shown in the hero banner instead of the default device graphic.",
    )

    # --- Optional sidebar note (any product can turn this on — not tied to
    # a specific product by name/slug) ---
    sidebar_note_title = models.CharField(
        max_length=100, blank=True,
        help_text="Leave blank to hide. e.g. 'Clinical Specialist Assistance'.",
    )
    sidebar_note_text = models.TextField(blank=True)
    sidebar_note_phone = models.CharField(max_length=30, blank=True)
    sidebar_note_email = models.EmailField(blank=True)
    sidebar_note_cta_label = models.CharField(max_length=80, blank=True, help_text="e.g. 'Request Spec Sheet (PDF)'")
    sidebar_note_cta_url = models.URLField(blank=True, help_text="Leave blank to link to the Contact page.")

    website_url = models.URLField(blank=True)
    app_store_url = models.URLField(blank=True)
    play_store_url = models.URLField(blank=True)
    download_url = models.URLField(blank=True, help_text="Direct download link, e.g. for desktop software.")

    # --- ThermaCheck-style ("badge_heavy") hardware/device product content.
    # These fields exist on every Product row but are only rendered by the
    # frontend when hero_layout == "badge_heavy"; leave them blank for
    # ordinary mobile/web/desktop products. ---
    concept_title = models.CharField(max_length=150, blank=True, default="THERMACHECK SCREENING CONCEPT")
    concept_description = models.TextField(blank=True)
    why_use_title = models.CharField(max_length=150, blank=True, default="WHY SHOULD YOU USE THERMACHECK?")
    why_use_points = models.TextField(blank=True, help_text="One 'Why use' bullet point per line.")
    software_suite_title = models.CharField(max_length=150, blank=True, default="OPTIMIZED IN MEDICAL USE (SOFTWARE SUITE)")
    spec_sheet_pdf = models.FileField(upload_to="products/pdfs/", blank=True, null=True, help_text="Downloadable spec sheet PDF file.")

    is_featured = models.BooleanField(default=False, help_text="Show on the homepage highlights.")
    highlight_features = models.TextField(
        blank=True,
        help_text="Homepage-only bullet points (one per line) for this product's highlight card. "
                   "Independent of the full product page content.",
    )
    highlight_link_label = models.CharField(
        max_length=100, blank=True,
        help_text="Homepage-only call-to-action text, e.g. 'Explore Remote Care Suite'.",
    )
    status = models.CharField(max_length=10, choices=PRODUCT_STATUS_CHOICES, default="published")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-is_featured", "name"]

    def __str__(self):
        return self.name

    def highlight_feature_list(self):
        return [f.strip() for f in self.highlight_features.splitlines() if f.strip()]

    def key_feature_list(self):
        return [f.strip() for f in self.key_features.splitlines() if f.strip()]

    def why_use_point_list(self):
        return [p.strip() for p in self.why_use_points.splitlines() if p.strip()]

    def specification_rows(self):
        rows = []
        for line in self.specifications.splitlines():
            line = line.strip()
            if not line:
                continue
            if ":" in line:
                label, value = line.split(":", 1)
                rows.append({"label": label.strip(), "value": value.strip()})
            else:
                rows.append({"label": line, "value": ""})
        return rows

    def hero_badges(self):
        return [b for b in [self.hero_badge_1, self.hero_badge_2, self.hero_badge_3, self.hero_badge_4] if b]


class ProductScreenshot(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="screenshots")
    image = models.ImageField(upload_to="products/screenshots/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — screenshot {self.order}"


class ProductLink(TimeStampedModel):
    """Extra, arbitrary links a product may need beyond the fixed URL fields
    above (e.g. 'API Docs', 'Case Study PDF', 'Demo Video')."""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="extra_links")
    label = models.CharField(max_length=80)
    url = models.URLField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — {self.label}"


class ProductSoftwareCard(TimeStampedModel):
    """One of the 4 dark software suite feature cards on the product page."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="software_cards")
    badge = models.CharField(max_length=40, blank=True, help_text="e.g. 'AUTO ROI', 'AI ASSIST'")
    title = models.CharField(max_length=100)
    description = models.TextField()
    footer_text = models.CharField(max_length=100, blank=True, help_text="e.g. 'Automated Contouring', '53 Disease Profiles'")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — {self.title}"


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Shared icon choices — used across Services, Ecosystem, Stats, etc.
# ---------------------------------------------------------------------------

ICON_CHOICES = [
    ("shield", "Shield (compliance / safety)"),
    ("clock", "Clock (experience / time)"),
    ("monitor", "Monitor (equipment / software)"),
    ("building", "Building (facilities / trust)"),
    ("check", "Check (verified / quality)"),
    ("wrench", "Wrench (maintenance / repair)"),
    ("video", "Video (telehealth / remote)"),
    ("chart", "Chart (diagnostics / analytics)"),
    ("package", "Package (spares / equipment)"),
    ("link", "Link (integration / ecosystem)"),
    ("file", "File (documentation / traceability)"),
    ("bolt", "Bolt (rapid response)"),
    ("eye", "Eye (vision)"),
    ("headset", "Headset (support)"),
    ("users", "Users (team)"),
    ("heart", "Heart (patient monitoring)"),
    ("flask", "Flask (lab / diagnostics)"),
    ("calendar", "Calendar (scheduling)"),
]


class Service(TimeStampedModel, SlugMixin):
    name = models.CharField(max_length=150)
    icon = models.CharField(max_length=50, blank=True)
    summary = models.TextField()
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="services/", blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Services page — tabbed sub-pages (e.g. Equipment Installation & Support,
# AMC & Maintenance, Training, Career). Each tab is a full page: its own
# hero banner, overview, feature grid, process timeline, optional equipment
# grid, CTA banner, and enquiry form. All content is admin-editable; only
# the layout/styling is fixed in the frontend.
# ---------------------------------------------------------------------------

FORM_TYPE_CHOICES = [
    ("support_demo", "Support & Demo Request (equipment/product fields)"),
    ("training_enquiry", "Training Enquiry (course/schedule fields)"),
    ("career_application", "Career Application (resume upload + candidate fields)"),
    ("general", "General enquiry (name, email, message only)"),
]


class ServicePage(TimeStampedModel, SlugMixin):
    nav_label = models.CharField(max_length=100, help_text="Short label shown in the tab bar, e.g. 'AMC & Maintenance'.")
    nav_icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="wrench")
    order = models.PositiveIntegerField(default=0)

    # --- Hero ---
    hero_eyebrow = models.CharField(max_length=60, blank=True, default="Our Services")
    hero_title_main = models.CharField(max_length=150, help_text="e.g. 'Equipment ' (the non-highlighted part).")
    hero_title_highlight = models.CharField(max_length=150, blank=True, help_text="e.g. 'Installation & Support' (shown in red).")
    hero_subtitle = models.CharField(max_length=250, blank=True)
    hero_badge_1_icon = models.CharField(max_length=20, choices=ICON_CHOICES, blank=True)
    hero_badge_1_text = models.CharField(max_length=60, blank=True)
    hero_badge_2_icon = models.CharField(max_length=20, choices=ICON_CHOICES, blank=True)
    hero_badge_2_text = models.CharField(max_length=60, blank=True)
    hero_badge_3_icon = models.CharField(max_length=20, choices=ICON_CHOICES, blank=True)
    hero_badge_3_text = models.CharField(max_length=60, blank=True)
    hero_badge_4_icon = models.CharField(max_length=20, choices=ICON_CHOICES, blank=True)
    hero_badge_4_text = models.CharField(max_length=60, blank=True)
    hero_cta_label = models.CharField(max_length=60, blank=True, help_text="Optional hero button, e.g. 'Request Training'.")
    hero_tagline = models.TextField(blank=True, help_text="Short lines shown in the floating hero card, one per line.")
    hero_image = models.ImageField(upload_to="services/hero/", blank=True, null=True)

    # --- Overview (main feature grid, e.g. 'Key Roles & Candidate Requirements') ---
    overview_eyebrow = models.CharField(max_length=80, blank=True, help_text="e.g. 'Opportunities at MedEx Biomed'")
    overview_title = models.CharField(max_length=150, blank=True, default="Service Overview")
    overview_subtitle = models.CharField(max_length=250, blank=True)
    overview_description = models.TextField(blank=True)

    # --- Process timeline ---
    process_title = models.CharField(max_length=150, blank=True, default="Our Process")
    process_subtitle = models.CharField(max_length=250, blank=True)

    # --- Equipment grid (optional — leave title blank to hide the section) ---
    equipment_title = models.CharField(max_length=150, blank=True, help_text="Leave blank to hide this section.")
    equipment_subtitle = models.CharField(max_length=250, blank=True)

    # --- Secondary grid (optional, e.g. 'Why Work With Us?') ---
    secondary_eyebrow = models.CharField(max_length=80, blank=True)
    secondary_title = models.CharField(max_length=150, blank=True, help_text="Leave blank to hide this section.")
    secondary_subtitle = models.CharField(max_length=250, blank=True)

    # --- Photo gallery (optional, e.g. 'Life at MedEx') ---
    gallery_title = models.CharField(max_length=150, blank=True, help_text="Leave blank to hide this section.")
    gallery_subtitle = models.CharField(max_length=250, blank=True)

    # --- CTA banner ---
    # Two supported layouts, chosen by what's filled in: leaving
    # cta_button_label blank shows the icon + Call Now/WhatsApp banner
    # (Equipment/AMC/Career style); setting it shows a single button with
    # an optional background photo instead (Training style).
    cta_icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="headset")
    cta_title = models.CharField(max_length=150, blank=True, default="Need Support?")
    cta_subtitle = models.CharField(max_length=250, blank=True)
    cta_image = models.ImageField(
        upload_to="services/cta/", blank=True, null=True,
        help_text="Optional background photo for the CTA banner (only used with the single-button style below).",
    )
    cta_button_label = models.CharField(
        max_length=60, blank=True,
        help_text="Leave blank for the default Call Now/WhatsApp banner. Set this (e.g. 'Request Training') "
                   "to show a single button instead, with the photo above as its background.",
    )
    cta_button_url = models.URLField(blank=True, help_text="Where the single CTA button links. Defaults to the Contact page.")

    # --- Enquiry form ---
    form_title = models.CharField(max_length=150, blank=True, default="Support & Demo Request")
    form_description = models.TextField(blank=True)
    form_type = models.CharField(max_length=20, choices=FORM_TYPE_CHOICES, default="support_demo")

    class Meta:
        verbose_name = "Services Page Tab"
        ordering = ["order"]

    def __str__(self):
        return self.nav_label

    def _source_field(self):
        return self.nav_label

    def hero_badges(self):
        return [
            {"icon": i, "text": t}
            for i, t in [
                (self.hero_badge_1_icon, self.hero_badge_1_text),
                (self.hero_badge_2_icon, self.hero_badge_2_text),
                (self.hero_badge_3_icon, self.hero_badge_3_text),
                (self.hero_badge_4_icon, self.hero_badge_4_text),
            ]
            if t
        ]

    def hero_tagline_lines(self):
        return [line.strip() for line in self.hero_tagline.splitlines() if line.strip()]


class ServiceFeatureItem(TimeStampedModel):
    """
    Feature-grid tile shown in a ServicePage's Overview section. Renders as
    one of three variants depending on what's filled in:
    - plain icon tile (just icon + title)
    - photo card (image + icon + title) — e.g. Training tab's program cards
    - rich role card (image + tag + focus/background text + apply link) —
      e.g. the Career tab's 'Key Roles & Candidate Requirements' cards
    """
    service_page = models.ForeignKey(ServicePage, on_delete=models.CASCADE, related_name="feature_items")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to="services/features/", blank=True, null=True)
    tag_label = models.CharField(
        max_length=60, blank=True,
        help_text="Small badge overlaid on the photo, e.g. 'Engineering & Field Ops'. Role cards only.",
    )
    focus_text = models.TextField(blank=True, help_text="'Typical Focus' description. Leave blank for a simple tile.")
    background_text = models.TextField(blank=True, help_text="'Target Background' description. Role cards only.")
    apply_url = models.URLField(blank=True, help_text="Leave blank to link to the Contact page.")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.service_page.nav_label} — {self.title}"


class ServiceProcessStep(TimeStampedModel):
    """One numbered step in a ServicePage's process timeline."""
    service_page = models.ForeignKey(ServicePage, on_delete=models.CASCADE, related_name="process_steps")
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.service_page.nav_label} — {self.title}"


class ServiceEquipmentItem(TimeStampedModel):
    """One tile in a ServicePage's 'Equipment We Support/Maintain' grid."""
    service_page = models.ForeignKey(ServicePage, on_delete=models.CASCADE, related_name="equipment_items")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="monitor")
    title = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.service_page.nav_label} — {self.title}"


class ServiceValueItem(TimeStampedModel):
    """One tile in a ServicePage's secondary grid, e.g. 'Why Work With Us?'."""
    service_page = models.ForeignKey(ServicePage, on_delete=models.CASCADE, related_name="value_items")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.service_page.nav_label} — {self.title}"


class ServiceGalleryImage(TimeStampedModel):
    """One photo in a ServicePage's gallery, e.g. 'Life at MedEx'."""
    service_page = models.ForeignKey(ServicePage, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="services/gallery/")
    caption = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.service_page.nav_label} — {self.caption or 'photo'}"


# ---------------------------------------------------------------------------
# Site-wide content (About page, stats, team, etc.) & contact
# ---------------------------------------------------------------------------

class HomeHero(TimeStampedModel):
    """
    Singleton: the homepage's hero banner. Everything here is content —
    background photo, headline, subtitle, buttons — the section's layout
    and styling stay fixed in the frontend.
    """

    eyebrow = models.CharField(max_length=100, blank=True, help_text="e.g. 'Biomedical Engineering · Digital Health · Better Care'")
    title_main = models.CharField(max_length=200, blank=True, help_text="e.g. 'Keeping Healthcare Technology Running '")
    title_highlight = models.CharField(max_length=200, blank=True, help_text="e.g. 'When It Matters Most.' (shown in the accent color)")
    subtitle = models.TextField(blank=True)
    background_image = models.ImageField(
        upload_to="home/hero/", blank=True, null=True,
        help_text="Full-width background photo for the hero banner.",
    )
    primary_button_label = models.CharField(max_length=60, blank=True, help_text="e.g. 'Explore Our Services'")
    primary_button_url = models.CharField(max_length=200, blank=True, help_text="e.g. '/services'")
    secondary_button_label = models.CharField(max_length=60, blank=True, help_text="e.g. 'Get a Quote'")
    secondary_button_url = models.CharField(max_length=200, blank=True, help_text="e.g. '/contact'")

    class Meta:
        verbose_name = "Homepage Hero Banner"
        verbose_name_plural = "Homepage Hero Banner"

    def __str__(self):
        return "Homepage Hero Banner"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class HomeTrustPoint(TimeStampedModel):
    """One item in the hero's trust-point row, e.g. 'Reliable Equipment'."""
    home_hero = models.ForeignKey(HomeHero, on_delete=models.CASCADE, related_name="trust_points")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    label = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label


class AboutSection(TimeStampedModel):
    """
    Singleton: content for the homepage's 'Who We Are' preview section.
    The section's layout/styling is fixed in the frontend — only the text,
    image, and badge/stat content below are editable here.
    """

    eyebrow = models.CharField(max_length=80, default="About MedEx")
    title = models.CharField(max_length=150, default="Who We Are")
    paragraph_1 = models.TextField(
        help_text="Supports basic HTML for emphasis, e.g. <strong>bold text</strong>."
    )
    paragraph_2 = models.TextField(blank=True, help_text="Supports basic HTML.")
    image = models.ImageField(upload_to="about/", blank=True, null=True)

    badge_icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="shield")
    badge_title = models.CharField(max_length=100, blank=True, help_text="e.g. 'NABH & ISO Compliant'")
    badge_subtitle = models.CharField(max_length=150, blank=True, help_text="e.g. 'Audited calibration precision'")

    class Meta:
        verbose_name = "Homepage 'Who We Are' Section"
        verbose_name_plural = "Homepage 'Who We Are' Section"

    def __str__(self):
        return "Homepage — Who We Are"

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce a single row
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # prevent deletion of the singleton

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                "paragraph_1": "Write an introduction for MedEX here in Django Admin.",
            },
        )
        return obj


class EcosystemPillar(TimeStampedModel):
    """
    Homepage-only: cards for 'The MedEx Biomed Ecosystem' section.
    Distinct from Product/Service — this is homepage marketing copy that
    summarizes the ecosystem, not a listing of individual products.
    """

    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="link")
    title = models.CharField(max_length=150)
    bullets = models.TextField(help_text="One bullet point per line.")
    link_label = models.CharField(max_length=80, blank=True, help_text="e.g. 'Field Verified'")
    link_url = models.URLField(blank=True, help_text="Leave blank to render as plain text (no link).")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Homepage Ecosystem Card"
        verbose_name_plural = "Homepage Ecosystem Cards"
        ordering = ["order"]

    def __str__(self):
        return self.title

    def bullet_list(self):
        return [b.strip() for b in self.bullets.splitlines() if b.strip()]


class OperatingPillar(TimeStampedModel):
    """Homepage-only: cards for the 'Our Operating Pillars' section."""

    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="shield")
    title = models.CharField(max_length=150)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Homepage Operating Pillar"
        verbose_name_plural = "Homepage Operating Pillars"
        ordering = ["order"]

    def __str__(self):
        return self.title


class VisionMission(TimeStampedModel):
    """Singleton: content for the 'Vision & Mission' section (used on Home and/or About)."""

    vision_title = models.CharField(
        max_length=200, blank=True,
        help_text="Short heading, e.g. 'To Be the Premier Clinical Technology & Biomedical Partner'.",
    )
    vision_text = models.TextField()
    mission_title = models.CharField(
        max_length=200, blank=True,
        help_text="Short heading, e.g. 'Fortifying Healthcare Infrastructure & Protecting Patient Lives'.",
    )
    mission_text = models.TextField()

    # --- 'Live Asset Network Status' dashboard mock shown beside the Vision text ---
    network_panel_title = models.CharField(max_length=100, blank=True, default="Live Asset Network Status")
    network_panel_status_label = models.CharField(max_length=40, blank=True, help_text="e.g. '99.98% Active'")
    network_panel_quote = models.TextField(blank=True)
    network_benchmark_title = models.CharField(max_length=100, blank=True, help_text="e.g. 'Zero Equipment Downtime'")
    network_benchmark_subtitle = models.CharField(max_length=200, blank=True)
    network_benchmark_tag = models.CharField(max_length=40, blank=True, default="Benchmark")

    # --- 'The MedEx Biomed Ecosystem' diagram shown beside the Mission steps.
    # The 3 satellite boxes reuse EcosystemPillar (the same data shown on the
    # homepage) rather than duplicating that content here. ---
    ecosystem_eyebrow = models.CharField(max_length=80, blank=True, default="Unified Operational Framework")
    ecosystem_title = models.CharField(max_length=150, blank=True, default="The MedEx Biomed Ecosystem")
    ecosystem_subtitle = models.CharField(max_length=200, blank=True)
    ecosystem_core_label = models.CharField(max_length=60, blank=True, default="Central Foundation")
    ecosystem_core_title = models.CharField(max_length=100, blank=True, default="MedEx Biomed Core")
    ecosystem_core_subtitle = models.CharField(max_length=200, blank=True)
    ecosystem_footer_badge_1 = models.CharField(max_length=60, blank=True, help_text="e.g. 'NABL & NABH Traceable'")
    ecosystem_footer_badge_2 = models.CharField(max_length=60, blank=True, help_text="e.g. 'ISO Standards Aligned'")

    class Meta:
        verbose_name = "Vision & Mission"
        verbose_name_plural = "Vision & Mission"

    def __str__(self):
        return "Vision & Mission"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(
            pk=1,
            defaults={
                "vision_text": "Write MedEX's vision statement here in Django Admin.",
                "mission_text": "Write MedEX's mission statement here in Django Admin.",
            },
        )
        return obj


class VisionHighlight(TimeStampedModel):
    """One checklist item under the Vision text, e.g. 'Zero-Downtime Guarantee for Critical Care Units'."""
    vision_mission = models.ForeignKey(VisionMission, on_delete=models.CASCADE, related_name="highlights")
    title = models.CharField(max_length=150)
    description = models.CharField(max_length=250, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class VisionStatusRow(TimeStampedModel):
    """One row in the 'Live Asset Network Status' dashboard mock, e.g. 'Intensive Care Ventilators (ICU): 100% Calibrated'."""
    vision_mission = models.ForeignKey(VisionMission, on_delete=models.CASCADE, related_name="status_rows")
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=60)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.label}: {self.value}"


class MissionPillar(TimeStampedModel):
    """One numbered step under the Mission text, e.g. 'Securing Clinical Uptime'."""
    vision_mission = models.ForeignKey(VisionMission, on_delete=models.CASCADE, related_name="mission_pillars")
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class TeamMember(TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    title = models.CharField(
        max_length=150, blank=True,
        help_text="Qualification/credentials line, e.g. 'DBCE, B.E (Bio Medical)'",
    )
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    bio = models.TextField(
        blank=True,
        help_text="Full biography for the About page's leadership profile. Separate paragraphs with a blank line.",
    )
    quote = models.CharField(max_length=250, blank=True, help_text="Pull-quote shown on the homepage and About page.")
    quote_label = models.CharField(max_length=60, blank=True, default="Leadership Philosophy")
    badge_text = models.CharField(max_length=80, blank=True, help_text="e.g. 'Verified Bio-Engineer' / 'Technical Leader'")
    years_text = models.CharField(max_length=80, blank=True, help_text="e.g. '10+ Years Biomedical Leadership'")
    prior_leadership = models.CharField(max_length=150, blank=True, help_text="e.g. 'Regional Manager, Colmed (8 yrs)'")
    domain_expertise = models.CharField(max_length=150, blank=True, help_text="e.g. 'Critical Care & Device Governance'")
    operational_base = models.CharField(max_length=150, blank=True, help_text="e.g. 'Chennai & South India Networks'")
    is_leadership = models.BooleanField(
        default=False, help_text="Show in the homepage 'Our Leadership' section and the About page's full profile."
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.role})"

    def bio_paragraphs(self):
        return [p.strip() for p in self.bio.split("\n\n") if p.strip()]


class CompanyStat(TimeStampedModel):
    """Small editable numbers used on the About/Home pages, e.g. '500+ Hospitals Served'."""

    label = models.CharField(max_length=100)
    value = models.CharField(max_length=30, help_text="e.g. '500+', '24/7', 'Trusted'")
    icon = models.CharField(
        max_length=20, choices=ICON_CHOICES, blank=True,
        help_text="Used by the homepage 'Who We Are' stat cards. Optional elsewhere.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.value} {self.label}"


class ContactMessage(TimeStampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    organization = models.CharField(max_length=150, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    interested_in = models.CharField(
        max_length=150, blank=True,
        help_text="Free-text value from the 'Select Service/Product' dropdown on the site.",
    )
    additional_info = models.TextField(
        blank=True,
        help_text="Extra fields from richer enquiry forms (e.g. product/model/serial number, "
                   "training preferences), formatted as plain text.",
    )
    message = models.TextField()
    resume = models.FileField(
        upload_to="resumes/", blank=True, null=True,
        help_text="Uploaded from the Career tab's application form.",
    )
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> — {self.subject or 'No subject'}"


# ---------------------------------------------------------------------------
# Site-wide identity & contact info (singleton) — logo, name, address, phone,
# email, hours, and social links. Everything here is content, not design:
# it's what appears in the Navbar, Footer, and Contact sections across the
# whole site.
# ---------------------------------------------------------------------------

class SiteSettings(TimeStampedModel):
    site_name = models.CharField(max_length=60, default="MedEx")
    logo = models.ImageField(
        upload_to="site/", blank=True, null=True,
        help_text="Shown in the navbar and footer. If left blank, the site name is shown as text instead.",
    )
    footer_tagline = models.CharField(
        max_length=200, blank=True,
        default="Precision biomedical engineering. Connected healthcare. Better tomorrows.",
    )

    address = models.CharField(max_length=250, blank=True, help_text="e.g. 'Chennai | Madurai | Others'")
    phone = models.CharField(max_length=30, blank=True, help_text="Include country code, e.g. '+91 00000 00000'")
    whatsapp_number = models.CharField(
        max_length=30, blank=True,
        help_text="Digits only with country code, no spaces or symbols, e.g. '910000000000'.",
    )
    email = models.EmailField(blank=True)
    business_hours = models.CharField(max_length=100, blank=True, default="Mon–Sat, 9:00am – 7:00pm")

    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def whatsapp_link(self):
        return f"https://wa.me/{self.whatsapp_number}" if self.whatsapp_number else ""


PAGE_CHOICES = [
    ("about", "About Us page"),
    ("services", "Services page"),
    ("contact", "Contact Us page"),
]


class PageIntro(TimeStampedModel):
    """
    One row per static page — the hero eyebrow/title/description shown at
    the top of that page, plus an optional bottom CTA banner's text.
    All editable in Django Admin; the page's layout/styling stays fixed.
    """

    page = models.CharField(max_length=20, choices=PAGE_CHOICES, unique=True)
    eyebrow = models.CharField(max_length=80, blank=True)
    title = models.CharField(max_length=200)
    title_highlight = models.CharField(
        max_length=100, blank=True,
        help_text="Optional final word(s) of the title shown in red, e.g. 'Reliable Healthcare'. "
                   "Leave blank for a single-color title.",
    )
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="page-intros/", blank=True, null=True,
        help_text="Optional hero photo/graphic for this page (e.g. the Contact page's hero image).",
    )

    cta_title = models.CharField(max_length=200, blank=True, help_text="Optional bottom CTA banner heading.")
    cta_text = models.TextField(blank=True, help_text="Optional bottom CTA banner body text.")

    class Meta:
        verbose_name = "Page Intro"

    def __str__(self):
        return self.get_page_display()


class AboutPageContent(TimeStampedModel):
    """Singleton: all the About Us page's section copy beyond the hero (which uses PageIntro)."""

    # --- Hero decorations (title/subtitle/description come from PageIntro page='about') ---
    hero_badge_title = models.CharField(max_length=100, blank=True, help_text="e.g. 'Technology In Safe Hands'")
    hero_highlight_value = models.CharField(max_length=20, blank=True, help_text="e.g. '10y+'")
    hero_highlight_label = models.CharField(max_length=100, blank=True, help_text="e.g. 'Operational Precision Standards'")
    hero_status_text = models.CharField(max_length=100, blank=True, help_text="e.g. 'Emergency Clinical Support Available'")

    # --- 'Our Story' section ---
    story_eyebrow = models.CharField(max_length=80, blank=True, default="Our Story")
    story_title = models.CharField(max_length=200, blank=True)
    story_paragraph_1 = models.TextField(blank=True)
    story_paragraph_2 = models.TextField(blank=True)
    story_quote = models.TextField(blank=True)
    story_image = models.ImageField(upload_to="about/story/", blank=True, null=True)
    story_image_badge = models.CharField(max_length=100, blank=True, help_text="e.g. 'Medex Biomed Headquarters'")
    story_caption_eyebrow = models.CharField(max_length=80, blank=True, help_text="e.g. 'Proven Excellence'")
    story_caption_text = models.CharField(max_length=150, blank=True, help_text="e.g. 'Trusted by Healthcare Providers Across the Region'")

    # --- 'About Director & Founder' section header (the person's own content lives on TeamMember) ---
    leadership_eyebrow = models.CharField(max_length=80, blank=True, default="About Director & Founder")
    leadership_title = models.CharField(max_length=150, blank=True, default="Leadership Driving Medical Excellence")

    # --- 'Why Choose Us' section ---
    why_choose_eyebrow = models.CharField(max_length=80, blank=True, default="Why Choose Us")
    why_choose_title_main = models.CharField(max_length=150, blank=True, help_text="e.g. 'More Than Service, '")
    why_choose_title_highlight = models.CharField(max_length=150, blank=True, help_text="e.g. 'A Long-Term Partnership' (shown in red)")
    why_choose_description = models.TextField(blank=True)

    class Meta:
        verbose_name = "About Page Content"
        verbose_name_plural = "About Page Content"

    def __str__(self):
        return "About Page Content"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class WhyChooseUsItem(TimeStampedModel):
    """One tile in the About page's 'Why Choose Us' grid."""
    about_page_content = models.ForeignKey(AboutPageContent, on_delete=models.CASCADE, related_name="why_choose_items")
    icon = models.CharField(max_length=20, choices=ICON_CHOICES, default="check")
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class OfficeLocation(TimeStampedModel):
    """
    One office/branch shown on the Contact page's map tabs. Any number of
    locations can be added/removed here — the frontend renders however
    many exist, rather than a fixed 'two tabs' layout.
    """

    name = models.CharField(max_length=100, help_text="e.g. 'Head Office — Chennai'")
    address = models.TextField()
    phone = models.CharField(max_length=30, blank=True, help_text="Leave blank to use the site-wide phone number.")
    map_embed_url = models.URLField(
        blank=True,
        help_text="Google Maps 'Embed a map' iframe src URL for this location.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class ContactPageContent(TimeStampedModel):
    """Singleton: the Contact page's form/details-card/map-section copy."""

    form_title = models.CharField(max_length=150, default="Send Us an Enquiry")
    form_description = models.TextField(blank=True)

    details_eyebrow = models.CharField(max_length=80, blank=True, default="Support & Reach")
    details_title = models.CharField(max_length=150, default="Our Contact Details")
    details_subtitle = models.CharField(max_length=200, blank=True)

    highlights_intro = models.TextField(
        blank=True,
        help_text="Short intro line above the support-highlights checklist, e.g. "
                   "'We're always here to support your healthcare technology needs.'",
    )

    map_eyebrow = models.CharField(max_length=80, blank=True, default="Location")
    map_title = models.CharField(max_length=150, default="Find Us on Map")
    map_description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Contact Page Content"
        verbose_name_plural = "Contact Page Content"

    def __str__(self):
        return "Contact Page Content"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class ContactHighlight(TimeStampedModel):
    """One line in the Contact page's support-highlights checklist, e.g. 'Quick Response'."""

    contact_page_content = models.ForeignKey(
        ContactPageContent, on_delete=models.CASCADE, related_name="highlights"
    )
    text = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.text