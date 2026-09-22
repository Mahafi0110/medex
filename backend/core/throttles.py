"""Rate limiting for the public write endpoint.

The Contact endpoint is the only part of the API that creates rows, so it is the
obvious spam target. Everything else stays read-only and unthrottled, because a
single homepage render makes ~9 API calls and a global anonymous throttle would
quickly lock real visitors out.

Client IPs: DRF reads X-Forwarded-For when `REST_FRAMEWORK["NUM_PROXIES"]` is
set (it is, in settings.py), which is required behind Render's proxy — otherwise
every visitor shares one counter.

Counters live in Django's default LocMemCache, i.e. per process. That is fine
for a small site; use a shared cache (Redis) if you need exact global limits.
"""
from rest_framework.throttling import AnonRateThrottle


class ContactRateThrottle(AnonRateThrottle):
    """Per-IP limit for Contact / Career-application submissions."""

    scope = "contact"
