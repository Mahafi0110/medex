"""
Django settings for the MedEX backend project.

Local dev uses SQLite by default. Set USE_POSTGRES=True (via .env) to switch
to PostgreSQL for staging/production, and provide the DB_* variables below.
"""
import os
import warnings
from pathlib import Path
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent

# Render sets RENDER_EXTERNAL_HOSTNAME on every service it hosts. Used below
# only to warn loudly about a configuration that silently loses data.
RENDER_EXTERNAL_HOSTNAME = os.environ.get("RENDER_EXTERNAL_HOSTNAME", "")
IS_RENDER = bool(RENDER_EXTERNAL_HOSTNAME)

# ---------------------------------------------------------------------------
# Core / security
# ---------------------------------------------------------------------------
SECRET_KEY = config("SECRET_KEY", default="dev-insecure-secret-key-change-me")
# DEBUG defaults to False on Render, so a forgotten env var can never expose
# tracebacks/SQL on the live site; locally it still defaults to True.
DEBUG = config("DEBUG", default=not IS_RENDER, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1", cast=Csv())
if RENDER_EXTERNAL_HOSTNAME:
    # Always trust the deployed hostname, so a missing ALLOWED_HOSTS entry
    # cannot cause "DisallowedHost" 400s on the live site.
    ALLOWED_HOSTS += [RENDER_EXTERNAL_HOSTNAME, ".onrender.com"]

# Render terminates HTTPS at its proxy, so Django would otherwise see every
# request as plain HTTP internally. This tells Django to trust the
# X-Forwarded-Proto header from that proxy, so request.is_secure() and the
# CSRF/session Secure-cookie checks work correctly.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# ---------------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third-party
    "rest_framework",
    "django_filters",
    "corsheaders",
    "anymail",  # <--- Add this here
    # local
    "core",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "medex_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "medex_backend.wsgi.application"

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
USE_POSTGRES = config("USE_POSTGRES", default=False, cast=bool)

if USE_POSTGRES:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": config("DB_NAME", default="medex"),
            "USER": config("DB_USER", default="medex"),
            "PASSWORD": config("DB_PASSWORD", default=""),
            # DB_HOST is the hostname ONLY — never "host/dbname", never a URL,
            # never a port. Render's Postgres page lists the pieces separately.
            "HOST": config("DB_HOST", default="localhost"),
            "PORT": config("DB_PORT", default="5432"),
            # Reuse connections instead of opening one per request. Render's
            # proxy drops idle connections, so health-check them as well.
            "CONN_MAX_AGE": config("DB_CONN_MAX_AGE", default=600, cast=int),
            "CONN_HEALTH_CHECKS": True,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
    if IS_RENDER:
        # Loud on purpose: this configuration is almost always a mistake. The
        # SQLite file lives on Render's EPHEMERAL filesystem, so every deploy,
        # restart and wake-from-idle starts from an empty database. This is
        # the usual reason content added through Django Admin "disappears".
        warnings.warn(
            "USE_POSTGRES is not enabled while running on Render. The SQLite "
            "database lives on an ephemeral disk and WILL BE WIPED on the "
            "next deploy/restart. Set USE_POSTGRES=True plus DB_NAME, DB_USER, "
            "DB_PASSWORD, DB_HOST and DB_PORT on this service.",
            RuntimeWarning,
            stacklevel=2,
        )

# ---------------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static & media
# ---------------------------------------------------------------------------
# Absolute path (with the leading slash) — this is what WhiteNoise uses as the
# URL prefix for STATIC_ROOT and what the Django Admin's {% static %} tags
# resolve against, so it must not be relative.
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Uploaded images live on the service's filesystem, which Render wipes on
# every deploy/restart. There are two ways to fix that:
#   * attach a Persistent Disk to the service and set MEDIA_ROOT_PATH to its
#     mount path (e.g. /var/data/media), or
#   * use S3-compatible object storage (USE_S3, below).
# Anything committed to the repo under media/ is present again after every
# deploy, because each deploy starts from a fresh checkout.
_media_root_path = config("MEDIA_ROOT_PATH", default="")
if _media_root_path:
    MEDIA_ROOT = Path(_media_root_path)

# Optional S3-compatible object storage for uploads (Cloudflare R2, Backblaze
# B2, AWS S3...). Requires `django-storages[s3]` — see requirements.txt.
USE_S3 = config("USE_S3", default=False, cast=bool)
if USE_S3:
    AWS_ACCESS_KEY_ID = config("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = config("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = config("AWS_STORAGE_BUCKET_NAME")
    AWS_S3_ENDPOINT_URL = config("AWS_S3_ENDPOINT_URL", default="")
    AWS_S3_REGION_NAME = config("AWS_S3_REGION_NAME", default="auto")
    AWS_S3_CUSTOM_DOMAIN = config("AWS_S3_CUSTOM_DOMAIN", default="")
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False
    STORAGES["default"] = {"BACKEND": "storages.backends.s3.S3Storage", "OPTIONS": {}}

# Serve /media/... through Django itself. Django's `static()` helper is a
# no-op when DEBUG=False, and WhiteNoise only serves collected STATIC_ROOT, so
# without this every image uploaded in Django Admin 404s in production.
SERVE_MEDIA = config("SERVE_MEDIA", default=not USE_S3, cast=bool)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# CORS / CSRF (React dev server + the deployed frontend)
# ---------------------------------------------------------------------------
# The deployed frontend's origin, e.g. https://medex-frontend.onrender.com
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:5173")

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173,http://127.0.0.1:5173",
    cast=Csv(),
)
CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS",
    default="http://localhost:5173,http://127.0.0.1:5173",
    cast=Csv(),
)

# Trust the deployed services automatically: without this, a forgotten env var
# locks you out of Django Admin ("403 CSRF verification failed").
if RENDER_EXTERNAL_HOSTNAME:
    _backend_origin = f"https://{RENDER_EXTERNAL_HOSTNAME}"
    if _backend_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(_backend_origin)
if FRONTEND_URL.startswith(("http://", "https://")):
    _frontend_origin = FRONTEND_URL.rstrip("/")
    if _frontend_origin not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(_frontend_origin)
    if _frontend_origin not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(_frontend_origin)

# The public API is anonymous-only (DRF skips CSRF checks for anonymous
# requests) and the React client does not rely on cookies, so credentials stay
# OFF — turning this on makes the browser require third-party cookies, which
# Safari/iOS block by default.
CORS_ALLOW_CREDENTIALS = config(
    "CORS_ALLOW_CREDENTIALS",
    default=False,
    cast=bool,
)

# ---------------------------------------------------------------------------
# Cross-site cookies (needed because frontend/backend are on different
# subdomains, e.g. *.onrender.com — the browser treats that as cross-site,
# not just cross-origin. SameSite=Lax cookies get silently dropped there,
# which breaks the CSRF-token flow even though CORS itself is fine).
# In local dev over plain http, SameSite=None without Secure is rejected by
# browsers, so these only kick in properly once DEBUG=False / HTTPS is used.
# ---------------------------------------------------------------------------
if not DEBUG:
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SECURE = True
# ---------------------------------------------------------------------------
# Logging — with DEBUG=False Django otherwise prints nothing to console on
# a 500 error, so unhandled exceptions show up in Render's log stream here
# instead of vanishing.
# ---------------------------------------------------------------------------
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}

# ---------------------------------------------------------------------------
# Email — Contact-form notifications
# ---------------------------------------------------------------------------
# Email credentials live in backend/.env locally and in the Render Dashboard
# ("Environment") when deployed — see .env.example for the full list. Set
# EMAIL_HOST (plus the credentials it needs) and the SMTP backend is used
# automatically; with nothing configured, Django's console backend prints each
# message into the log stream, so a submission is never silently lost.

# A host with a blank user/password would make every submission wait for a
# failed login and only log an error, so a real SMTP server is used only once
# ALL THREE of host, user and password are present (Google Workspace/Gmail
# and Microsoft 365 both authenticate, so EMAIL_HOST_USER is never empty in
# practice).
EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"

ANYMAIL = {
    "RESEND_API_KEY": config("RESEND_API_KEY", default=""),
}

DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL", default="MedEX Website <onboarding@resend.dev>"
)

# Who receives Contact-form / Career-application notifications.
CONTACT_NOTIFY_EMAILS = config("CONTACT_NOTIFY_EMAILS", default="", cast=Csv())

# Who receives Contact-form / Career-application notifications. Falls back to
# Site Settings -> email when empty.
# ---------------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    # Rate limits are applied per-view (only the public Contact endpoint uses
    # one) rather than globally: a single homepage render makes ~9 API calls, so
    # a global anonymous throttle would lock real visitors out.
    "DEFAULT_THROTTLE_RATES": {
        "contact": config("CONTACT_THROTTLE_RATE", default="10/hour"),
    },
    # Render terminates TLS at one proxy in front of the app, so client IPs
    # arrive in X-Forwarded-For. Without this, all visitors share a single
    # throttle counter and get rate-limited together.
    "NUM_PROXIES": config("NUM_PROXIES", default=1, cast=int),
}
