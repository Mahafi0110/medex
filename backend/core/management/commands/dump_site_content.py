"""Write the content snapshot used by `init_content`, as portable UTF-8.

Why this exists instead of a plain `dumpdata --output`:

    On Windows, `manage.py dumpdata --output file.json` writes the file with the
    *locale* encoding (typically cp1252) and CRLF endings. The site content
    contains characters like "—" and "–", which come out as a bare 0x96 byte,
    and `loaddata` on a UTF-8 Linux host (Render) then dies with
    "UnicodeDecodeError: invalid start byte". Redirecting with PowerShell's ">"
    is worse still: it produces UTF-16 with a BOM.

This command always writes UTF-8 with LF endings, so the snapshot loads on any
platform. Regenerate it after editing content locally:

    python manage.py dump_site_content
"""
import io
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import BaseCommand

DEFAULT_SNAPSHOT_NAME = "site_content.json"


class Command(BaseCommand):
    help = "Writes a portable UTF-8 content snapshot to core/fixtures/ (loadable on Linux/Render)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--fixture",
            default=DEFAULT_SNAPSHOT_NAME,
            help=f"Output filename inside core/fixtures/ (default: {DEFAULT_SNAPSHOT_NAME}).",
        )

    def handle(self, *args, **options):
        output_path = Path(__file__).resolve().parents[2] / "fixtures" / options["fixture"]
        output_path.parent.mkdir(parents=True, exist_ok=True)

        buffer = io.StringIO()
        # --exclude keeps contact-form submissions (customer data) out of the
        # snapshot; only the `core` app is dumped, so no auth users/permissions.
        call_command(
            "dumpdata",
            "core",
            "--exclude",
            "core.contactmessage",
            "--indent",
            "2",
            stdout=buffer,
        )

        output_path.write_text(buffer.getvalue(), encoding="utf-8", newline="\n")
        self.stdout.write(
            self.style.SUCCESS(
                f"Wrote {output_path} ({output_path.stat().st_size} bytes, UTF-8/LF)."
            )
        )
