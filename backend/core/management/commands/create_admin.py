"""Create (or repair) the Django Admin superuser from environment variables.

Render's Free instances have no Shell, so `manage.py createsuperuser` cannot be
run interactively on them. This command is designed to live in a build script:

* no DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD  -> prints a notice
  and exits cleanly (exit code 0), so the deploy keeps working;
* user missing  -> creates it and sets the password;
* user exists   -> only guarantees staff/superuser flags. The password is NOT
  reset, so a password changed in Django Admin stays changed. Pass
  --reset-password (or DJANGO_SUPERUSER_FORCE_RESET=True) to overwrite it.
"""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from decouple import config


class Command(BaseCommand):
    help = "Creates or repairs the Django Admin superuser from DJANGO_SUPERUSER_* env vars."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="", help="Overrides DJANGO_SUPERUSER_USERNAME.")
        parser.add_argument("--email", default="", help="Overrides DJANGO_SUPERUSER_EMAIL.")
        parser.add_argument("--password", default="", help="Overrides DJANGO_SUPERUSER_PASSWORD.")
        parser.add_argument(
            "--reset-password",
            action="store_true",
            help="Also reset the password of an existing user (env: DJANGO_SUPERUSER_FORCE_RESET=True).",
        )

    def handle(self, *args, **options):
        User = get_user_model()

        username = options["username"] or config("DJANGO_SUPERUSER_USERNAME", default="")
        email = options["email"] or config("DJANGO_SUPERUSER_EMAIL", default="")
        password = options["password"] or config("DJANGO_SUPERUSER_PASSWORD", default="")
        force_reset = options["reset_password"] or config(
            "DJANGO_SUPERUSER_FORCE_RESET", default=False, cast=bool
        )

        if not username or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD are not set "
                    "- skipping admin user creation."
                )
            )
            return

        try:
            user = User.objects.get(username=username)
            created = False
        except User.DoesNotExist:
            user = User(username=username)
            created = True
        except IntegrityError:
            # A different user already owns this username in an odd way; leave it be.
            self.stdout.write(self.style.WARNING(f"Could not resolve username '{username}' - skipping."))
            return

        if email:
            user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True

        if created or force_reset:
            user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Admin superuser '{username}' created."))
        elif force_reset:
            self.stdout.write(self.style.SUCCESS(f"Admin superuser '{username}' password reset."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Admin superuser '{username}' already exists (password untouched)."))
