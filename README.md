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
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # adjust SECRET_KEY etc. as needed

python manage.py migrate
python manage.py createsuperuser # create your admin login
python manage.py seed_demo_data  # optional: adds sample products/services/stats
python manage.py runserver 8000
```

- API root: `http://127.0.0.1:8000/api/v1/`
- Admin (CMS): `http://127.0.0.1:8000/admin/`

To switch to PostgreSQL for staging/production, set `USE_POSTGRES=True` in
`.env` and fill in the `DB_*` variables — no code changes needed.

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

For production, set `VITE_API_BASE_URL` to your deployed backend's API root,
then:

```bash
npm run build
```

This outputs a static `dist/` folder ready to deploy to any static host
(Vercel, Netlify, S3/CloudFront, Nginx, etc.).

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

## Notes on scaling this further

- Add new product categories or products entirely from Django Admin — no
  frontend changes needed, the listing/detail pages are fully data-driven.
- To add a new page type (e.g. a blog or case studies section), follow the
  existing pattern: a model + admin registration + serializer + viewset on
  the backend, and a page + route on the frontend.
- Image uploads currently save to local `media/` in development; for
  production, plug in a storage backend such as `django-storages` with S3
  (or similar) by changing `DEFAULT_FILE_STORAGE` in `settings.py`.
