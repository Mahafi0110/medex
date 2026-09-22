#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Render build script for the MedEX backend.
#
# Render runs this on every deploy. Use it as the service's Build Command:
#
#       ./build.sh
#
# (If you prefer typing commands into the dashboard instead, the equivalent
# one-liner is:
#   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate )
#
# NOTE: this file MUST keep LF line endings — a shell script checked out with
# CRLF fails on Linux with "bad interpreter". .gitattributes enforces that.
# ---------------------------------------------------------------------------
set -o errexit

echo "--> Installing Python dependencies"
pip install -r requirements.txt

echo "--> Collecting static files (Django Admin CSS/JS, site assets)"
python manage.py collectstatic --no-input

echo "--> Applying database migrations"
python manage.py migrate --no-input

# One-time content switch: wipe the existing content rows so the snapshot below
# loads with no collisions. Set RESET_CONTENT=True for ONE deploy, then remove
# it. Users, permissions and contact messages are never touched.
if [ "${RESET_CONTENT:-False}" = "True" ]; then
  echo "--> Clearing existing content (RESET_CONTENT=True)"
  python manage.py reset_content --yes
fi

echo "--> Loading the content snapshot (skips automatically if content already exists)"
python manage.py init_content

# Restore/overwrite the live content from core/fixtures/site_content.json.
# Set FORCE_CONTENT_LOAD=True in the dashboard for ONE deploy, then remove it.
if [ "${FORCE_CONTENT_LOAD:-False}" = "True" ]; then
  echo "--> Restoring content snapshot (FORCE_CONTENT_LOAD=True)"
  python manage.py init_content --force
fi

# Sample/demo content. Off by default: leave it off to keep the CMS clean and
# write everything yourself. Even when enabled it does nothing if the database
# already has content, so it can never overwrite your admin edits.
if [ "${SEED_DEMO_DATA:-False}" = "True" ]; then
  echo "--> Seeding demo content (SEED_DEMO_DATA=True)"
  python manage.py seed_demo_data
fi

echo "--> Ensuring the Django Admin login exists"
python manage.py create_admin

echo "--> Build complete"
