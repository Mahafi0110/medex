"""Load the content snapshot bundled at `core/fixtures/site_content.json`.

Purpose: a fresh deployment should go live with exactly the content that was
entered through Django Admin locally, instead of an empty site.

Safety rules:

* If the database already has content, this command does nothing (unless
  --force is passed), so it can live in a build script and run on every deploy
  without ever clobbering edits made in Django Admin.
* The snapshot only contains the `core` app, so no auth users, permissions or
  content types are touched. Contact-form submissions are excluded from the
  snapshot too (they are customer data, not site content).

To refresh the snapshot from your local database:

    python manage.py dumpdata core --exclude core.contactmessage \
        --indent 2 --output core/fixtures/site_content.json
"""
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand

from core.models import (
    AboutPageContent,
    CompanyStat,
    ContactPageContent,
    EcosystemPillar,
    HomeHero,
    OperatingPillar,
    PageIntro,
    Product,
    ProductCategory,
    Service,
    ServicePage,
    SiteSettings,
    TeamMember,
    VisionMission,
)

DEFAULT_FIXTURE = "site_content.json"

# Every model that holds content the client manages in Django Admin. If any of
# them has rows, the database is not empty and the snapshot must not be loaded.
CONTENT_MODELS = (
    ProductCategory,
    Product,
    Service,
    ServicePage,
    HomeHero,
    PageIntro,
    TeamMember,
    CompanyStat,
    EcosystemPillar,
    OperatingPillar,
    VisionMission,
    AboutPageContent,
    ContactPageContent,
    SiteSettings,
)


class Command(BaseCommand):
    help = "Loads the bundled site content snapshot into an EMPTY database (no-op if content exists)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Load the snapshot even when the database already has content. "
                 "Rows with the same primary keys are overwritten.",
        )
        parser.add_argument(
            "--fixture",
            default=DEFAULT_FIXTURE,
            help=f"Fixture file inside core/fixtures/ (default: {DEFAULT_FIXTURE}).",
        )

    def handle(self, *args, **options):
        fixture_path = Path(__file__).resolve().parents[2] / "fixtures" / options["fixture"]

        if not fixture_path.exists():
            self.stdout.write(
                self.style.WARNING(f"Content snapshot not found at {fixture_path} - nothing to load.")
            )
            return

        if not options["force"] and any(model.objects.exists() for model in CONTENT_MODELS):
            self.stdout.write(
                self.style.WARNING(
                    "Content already exists in this database - skipping the snapshot "
                    "(pass --force to load it anyway)."
                )
            )
            return

        call_command("loaddata", str(fixture_path), verbosity=options["verbosity"])
        self.stdout.write(self.style.SUCCESS(f"Loaded site content from {fixture_path.name}."))
