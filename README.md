# MedEX Website

A multi-page corporate website for MedEX (healthcare technology & biomedical
engineering). Content is managed by the client through Django Admin; the
public site is a React + TypeScript + Tailwind CSS frontend talking to a
Django REST Framework API.

```
medex/
├── backend/     Django + DRF API + Django Admin (the CMS)
└── frontend/    React + TypeScript + Tailwind CSS site
```

## Backend setup

```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env             # adjust SECRET_KEY etc. as needed

python manage.py migrate
python manage.py createsuperuser # create your admin login
python manage.py runserver 8000
```

- API root: `http://127.0.0.1:8000/api/v1/`
- Health check: `http://127.0.0.1:8000/api/v1/health/` — reports which database
  the backend is using and how much content it holds
- Admin (CMS): `http://127.0.0.1:8000/admin/`

> **Python 3.12** is required (Django 5.0 / psycopg2 / Pillow builds). The repo
> pins it with `.python-version`; Render does **not** read `runtime.txt`.

### Management commands

| Command | What it does |
| --- | --- |
| `migrate` | Applies database migrations. Required after every model change. |
| `createsuperuser` | Interactive first admin login (local only — Render Free has no Shell). |
| `create_admin` | Creates/repairs the admin login from `DJANGO_SUPERUSER_*` env vars. Safe to run on every deploy. |
| `init_content` | Loads `core/fixtures/site_content.json` into an **empty** database; does nothing if content already exists. `--force` overwrites. |
| `dump_site_content` | Writes `core/fixtures/site_content.json` from the current database (UTF-8, Windows-safe). |
| `reset_content --yes` | Deletes all site content (keeps users + contact messages). `--yes` is required. |
| `seed_demo_data` | Sample products/services/stats. **Does nothing if content exists** unless `--force` is passed. |
| `collectstatic` | Copies admin/site static files into `staticfiles/` for WhiteNoise. |

To switch to PostgreSQL, set `USE_POSTGRES=True` in `.env` and fill in the
`DB_*` variables — no code changes needed. **`DB_HOST` is the hostname only**
(never `host/dbname`, never a URL, never a port).


### Content model (what the client manages in Django Admin)

- **Product categories** — Mobile Applications, Web Applications, Desktop
  Software, Healthcare Tools (or any custom set)
- **Products** — name, tagline, summary/description, specifications, logo,
  cover image, website/App Store/Play Store/download links, plus unlimited
  screenshots and extra links per product
- **Services** — name, summary, description, image
- **Team members** and **company stats** (e.g. "150+ Hospitals Served")
- **Contact messages** — submissions from the site's Contact form land here
  as read-only entries

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env    # optional — dev proxy works out of the box
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/api` requests to
`http://127.0.0.1:8000` (see `vite.config.ts`), so run the backend first.

## Deploying to Render

Two services plus one database:

| Service | Type | Root directory | Purpose |
| --- | --- | --- | --- |
| `medex-backend` | Web service (Python) | `backend` | Django REST API **and** Django Admin (the CMS) |
| `medex-frontend` | Static site | `frontend` | The React site |
| `medex-db` | Render Postgres | — | All text content |

### Option A — Blueprint (recommended)

`render.yaml` in the repo root defines all three. In the Render Dashboard:
**New + → Blueprint → pick this repo**, then fill in the values marked
`sync: false` (`FRONTEND_URL`, `DJANGO_SUPERUSER_*`).

### Option B — configure the services by hand

**Backend web service** (Settings → Build & Deploy):

```
Build Command:     ./build.sh
Start Command:     gunicorn medex_backend.wsgi:application --bind 0.0.0.0:$PORT
Health Check Path: /api/v1/health/
```

`build.sh` runs `pip install` → `collectstatic` → `migrate` → `init_content`
→ `create_admin`. If you'd rather not use the script:

```
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

**Environment variables** (backend service):

| Key | Value |
| --- | --- |
| `PYTHON_VERSION` | `3.12.8` — **required**; Render ignores `runtime.txt` and otherwise uses Python 3.14, where Django 5.0 / psycopg2 / Pillow fail to build |
| `SECRET_KEY` | long random string |
| `DEBUG` | `False` (already the default on Render) |
| `USE_POSTGRES` | `True` — **without this the site silently uses SQLite on an ephemeral disk and loses all content on every deploy** |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | from the Postgres page (hostname only, no `/dbname`) |
| `FRONTEND_URL` | `https://<your-frontend>.onrender.com` |
| `DJANGO_SUPERUSER_USERNAME` / `_EMAIL` / `_PASSWORD` | your Django Admin login; `create_admin` creates it during the build |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | SMTP mailbox used to email Contact-form submissions (see "Contact-form notifications") |
| `CONTACT_NOTIFY_EMAILS` | comma-separated recipients for enquiry emails; defaults to Site Settings → email |
| `CONTACT_THROTTLE_RATE` | per-IP limit on the public Contact/Career forms (default `10/hour`) |

`ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS` do **not** need to be set: the
backend adds its own Render hostname and `FRONTEND_URL` automatically.

**Frontend static site:**

```
Build Command:      npm ci && npm run build
Publish Directory:  dist
Environment:        VITE_API_BASE_URL = https://<backend>.onrender.com/api/v1
Redirect/Rewrite:   Source /*  →  Destination /index.html   (required for React Router)
```

`VITE_*` values are inlined at build time: change one and the site must be
rebuilt. The `/*` rewrite is what stops `/products/<slug>` from 404-ing when the
page is opened directly or refreshed.


### First deploy checklist

1. Wait for the backend build to finish, then open
   `https://<backend>.onrender.com/api/v1/health/`. It must show
   `"database": "postgresql"` and non-zero `content_counts`. If it says
   `"sqlite"`, stop and fix `USE_POSTGRES` + `DB_*` — nothing typed into the CMS
   will survive otherwise.
2. Log in at `https://<backend>.onrender.com/admin/` with the
   `DJANGO_SUPERUSER_*` credentials.
3. Open the frontend and confirm the content renders.

### Bringing your local content to the live site

`backend/core/fixtures/site_content.json` is a snapshot of everything entered
through Django Admin (products, services, page copy, stats, team, site settings
and the image paths). It is loaded automatically into an **empty** database on
the first deploy.

After editing content locally, refresh the snapshot and redeploy:

```bash
cd backend
python manage.py dump_site_content     # writes UTF-8, loadable on Linux
git add core/fixtures/site_content.json && git commit -m "Update content snapshot"
```

To move a snapshot onto a database that already has content (for example a
half-filled live CMS), set **one** of these in the service's environment for a
single deploy, then remove it:

- `RESET_CONTENT=True` — deletes all existing content **first**, so the snapshot
  lands with no leftover rows. Your admin login and contact-form submissions are
  kept. Use this when switching a deployed database over to your local content.
- `FORCE_CONTENT_LOAD=True` — keeps existing rows and overwrites only the ones
  whose primary keys appear in the snapshot.

> Use `dump_site_content`, not `dumpdata --output`: on Windows the latter writes
> the file in the locale encoding (cp1252), and `loaddata` on Render then fails
> with `UnicodeDecodeError: invalid start byte`.

### Contact-form notifications & spam protection

When someone submits the Contact or Career form the record is **always** stored
(Django Admin → Contact messages), and the backend then emails the enquiry to
the site's team:

- Set `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD`
  (plus `DEFAULT_FROM_EMAIL`) and Django switches to the SMTP backend
  automatically.
- `CONTACT_NOTIFY_EMAILS` is the comma-separated recipient list; if it is empty,
  **Site Settings → email** is used. If neither is set, the submission is still
  stored and a warning is logged.
- With `EMAIL_HOST` empty, Django's console backend prints the full message into
  the server log, so nothing is ever silently lost.
- Notifications are best-effort: a failing SMTP server can never turn a valid
  submission into an error for the visitor. Failures are logged
  (`django.core.mail`, see the LOGGING config) and the record stays in Admin.
- Resumes uploaded through the Career form are attached when they are ≤ 5 MB.

The public form is rate-limited **per visitor IP** (`CONTACT_THROTTLE_RATE`,
default `10/hour`) to keep spam out of the database. Read-only endpoints are not
throttled, because one homepage render makes ~9 API calls. Behind Render the
limit needs `NUM_PROXIES=1` (already the default) so each visitor is counted
separately instead of everyone sharing the proxy's IP.

### Pages

| Route              | Purpose                                             |
|---------------------|------------------------------------------------------|
| `/`                 | Home — hero, stats, featured products, services, CTA |
| `/products`         | Product listing with category filters                |
| `/products/:slug`   | Product detail — screenshots, overview, specs, links  |
| `/services`         | Services listing                                      |
| `/about`            | About Us / company stats                              |
| `/contact`          | Contact form (posts to `/api/v1/contact/`)            |

### Structure

- `src/api/client.ts` — typed fetch wrapper for the DRF API
- `src/types/` — TypeScript interfaces matching the DRF serializers
- `src/hooks/useAsync.ts` — small data-fetching hook used by every page
- `src/components/` — reusable UI (Navbar, Footer, ProductCard, ServiceCard,
  StatsBar, SectionHeading, loading/error states)
- `src/pages/` — one file per route
- `tailwind.config.js` — brand color tokens (red/blue/pink palette, exact
  hex values from the brief) and shared border-radius/shadow tokens

## Keeping content safe (read before typing the whole site in)

- **Free Render Postgres is deleted 30 days after creation** (1 GB, no backups).
  If you are entering the whole site by hand, upgrade the database first.
- Text lives in Postgres — that is the only durable place for it. Never let a
  deployed backend run on SQLite. `GET /api/v1/health/` tells you which database
  is in use and how many rows each content type has.
- **Uploaded images** are written to the service's local disk, which Render
  wipes on every deploy, restart and (on Free instances) wake-from-idle. Images
  committed under `backend/media/` return with each deploy (so the site's
  existing pictures keep working); images uploaded through Django Admin later do
  not. For those, choose one:
  - **S3-compatible object storage** (recommended; Cloudflare R2 has a free
    tier): uncomment `django-storages[s3]` in `requirements.txt`, then set
    `USE_S3=True` and the `AWS_*` variables on the service.
  - **Persistent Disk** (paid instances only): attach a disk and set
    `MEDIA_ROOT_PATH=/var/data/media`.
- `seed_demo_data` is never run automatically, and even if you add it to your
  deploy command it refuses to touch a database that already has content — so it
  cannot overwrite work done in Django Admin. Use it (`--force` for a deliberate
  re-seed) only when you actually want the sample products/services.

## Notes on scaling this further

- Add new product categories or products entirely from Django Admin — no
  frontend changes needed, the listing/detail pages are fully data-driven.
- To add a new page type (e.g. a blog or case studies section), follow the
  existing pattern: a model + admin registration + serializer + viewset on
  the backend, and a page + route on the frontend.


## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Build fails installing Django / psycopg2 / Pillow | Render used Python 3.14 | Set `PYTHON_VERSION=3.12.8` (or keep the `.python-version` files) |
| `DisallowedHost` 400 | `ALLOWED_HOSTS` missing the hostname | Automatic via `RENDER_EXTERNAL_HOSTNAME`; for a custom domain add it to `ALLOWED_HOSTS` |
| Admin login: `403 CSRF verification failed` | Origin not trusted | Set `FRONTEND_URL`; the backend's own hostname is trusted automatically |
| `no such table: core_...` | `migrate` never ran | Add it to the build command, or use `build.sh` |
| Admin unstyled / `Missing staticfiles manifest entry` | `collectstatic` never ran | Add it to the build command, or use `build.sh` |
| Content disappears after every deploy | Backend is on SQLite (`/api/v1/health/` shows `"sqlite"`) | Set `USE_POSTGRES=True` + the `DB_*` variables |
| Uploaded images 404 on the deployed site | Media is not on the deploy's disk | Commit them under `backend/media/`, or configure S3/R2 or a Persistent Disk |
| Contact form fails in the browser console (CORS) | Frontend origin not allowed | Set `FRONTEND_URL` (or `CORS_ALLOWED_ORIGINS`) to the frontend's exact origin |
| Frontend routes 404 on refresh | Static site has no SPA rewrite | Add rewrite `/*` → `/index.html` |
| `loaddata` fails with `UnicodeDecodeError` | Fixture written by `dumpdata --output` on Windows (cp1252) | Regenerate with `python manage.py dump_site_content` |
| Tester submitted the form, no email arrived | `EMAIL_HOST` / `CONTACT_NOTIFY_EMAILS` not set, or (on Render **Free**) outbound SMTP ports 25/465/587 are blocked | The submission is always in Django Admin → Contact messages; set the `EMAIL_*` vars (paid instance or office server), or look for the printed message in the log stream |
| Visitor sees "Too many submissions from this device" | Contact-form rate limit reached | Raise `CONTACT_THROTTLE_RATE` |
| Enquiry emails all appear to come from one IP / limits hit globally | Proxy hops not configured | Keep `NUM_PROXIES=1` on Render |

