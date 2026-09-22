"""Delete every Django-Admin content row so a snapshot can be loaded cleanly.

Used by `backend/build.sh` when `RESET_CONTENT=True`: it empties the content
tables **before** `init_content` runs, so the deployed database ends up matching
`core/fixtures/site_content.json` exactly, with no leftover rows.

Singletons (HomeHero, SiteSettings, AboutPageContent...) cannot be deleted from
Django Admin - their `delete()` is deliberately a no-op. Deleting through the
queryset bypasses that override, which is why this command can do it.

Untouched on purpose: users/permissions (your admin login) and ContactMessage
(customer enquiries submitted through the site's contact form).
"""
from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

# Leaf tables first: Product.category is on_delete=PROTECT, so categories must
# be deleted after the products that reference them.
DELETION_ORDER = [
    "ProductScreenshot",
    "ProductLink",
    "Product",
    "ProductCategory",
    "ServiceFeatureItem",
    "ServiceProcessStep",
    "ServiceEquipmentItem",
    "ServiceValueItem",
    "ServiceGalleryImage",
    "ServicePage",
    "Service",
    "HomeTrustPoint",
    "HomeHero",
    "VisionHighlight",
    "VisionStatusRow",
    "MissionPillar",
    "VisionMission",
    "WhyChooseUsItem",
    "AboutPageContent",
    "ContactHighlight",
    "ContactPageContent",
    "EcosystemPillar",
    "OperatingPillar",
    "TeamMember",
    "CompanyStat",
    "SiteSettings",
    "PageIntro",
    "AboutSection",
    "OfficeLocation",
]


class Command(BaseCommand):
    help = "Deletes all site content (products, services, page copy, images...) so a snapshot can be loaded cleanly."

    def add_arguments(self, parser):
        parser.add_argument("--yes", action="store_true", help="Required confirmation flag.")

    def handle(self, *args, **options):
        if not options["yes"]:
            raise CommandError(
                "Refusing to delete site content without --yes. "
                "This removes every product, service, page copy row and image reference."
            )

        core_app = apps.get_app_config("core")
        with transaction.atomic():
            for model_name in DELETION_ORDER:
                model = core_app.get_model(model_name)
                deleted, _ = model.objects.all().delete()
                self.stdout.write(f"  cleared {deleted:>4} row(s) from {model_name}")

        self.stdout.write(
            self.style.SUCCESS(
                "Content cleared (users/permissions and contact messages were kept). "
                "Load a snapshot with: python manage.py init_content"
            )
        )
