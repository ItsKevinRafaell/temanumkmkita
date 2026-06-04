# Teman UMKM Kita — AI Agent Rules

> Panduan untuk semua AI agent (Claude Code, CommandCode, Codex, Cursor, Windsurf)
> Selalu ikuti aturan ini sebelum menulis kode di repo ini.

---

## Project Identity

Website company profile + blog CMS untuk [Teman UMKM Kita](https://temanumkmkita.com).
Dibangun oleh [Kevin Rafaell](https://github.com/ItsKevinRafaell).

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript 5, Tailwind CSS 3, Framer Motion |
| Backend API | FastAPI (Python 3.13), SQLAlchemy 2.0, bcrypt, JWT |
| Database | MySQL (shared hosting) |
| Frontend Hosting | Vercel |
| Backend Hosting | LiteSpeed + Passenger WSGI (shared hosting) |
| Domains | temanumkmkita.com / api.temanumkmkita.com |

Line count: ~8,000 lines frontend TypeScript, ~1,350 lines backend Python.

---

## Git Workflow (WAJIB DIIKUTI)

### Branch strategy: Feature Branch

```
main          ← production, auto-deploy Vercel
feat/xxx      ← fitur baru
fix/xxx       ← perbaikan bug
chore/xxx     ← maintenance, deps, refactor
```

### Naming convention branch

```
feat/<deskripsi-fitur>
feat/contact-form-crm-forward
feat/admin-export-csv

fix/<deskripsi-bug>
fix/login-500-bcrypt
fix/mobile-nav-overflow

chore/<deskripsi-maintenance>
chore/upgrade-next-15
chore/clean-legacy-models
```

Format: `type/kebab-case-deskripsi` — lowercase, kata dipisah tanda hubung, maks 4-5 kata.

### Cara kerja

```
git checkout main
git pull origin main
git checkout -b feat/nama-fitur          # buat feature branch
# kerjakan perubahan
git add -A
git commit -m "feat: deskripsi singkat"  # conventional commit
git push origin feat/nama-fitur          # push branch
# merge via GitHub PR atau merge langsung
git checkout main
git merge feat/nama-fitur
git push origin main                     # auto-deploy Vercel
git branch -d feat/nama-fitur            # hapus local
git push origin --delete feat/nama-fitur # hapus remote
```

### Commit convention: [Conventional Commits](https://www.conventionalcommits.org/)

```
feat: deskripsi fitur baru
fix: deskripsi perbaikan bug
chore: maintenance, deps, config
```

### Auto-deploy

- **Push ke `main` → Vercel otomatis deploy frontend**
- Backend di shared hosting di-deploy manual via rsync/SFTP

### Larangan keras
- JANGAN commit langsung ke `main` — selalu lewat feature branch
- JANGAN rebase
- JANGAN force push
- JANGAN edit `.env` atau file dengan credentials
- JANGAN biarkan branch stale — hapus setelah di-merge

---

## Directory Structure

```
temanumkmkita/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Panel admin (authors, categories, content-map, posts, portfolio, settings)
│   │   ├── blog/               # Blog publik (list, detail, author)
│   │   ├── kontak/             # Contact form page
│   │   ├── layanan/            # 6 service pages (web-dev, seo, sosmed, maintenance, desain-logo, web-dev-bulanan)
│   │   ├── tentang-kami/       # About page
│   │   ├── api/                # Next.js API routes (jika ada)
│   │   ├── layout.tsx          # Root layout (font, metadata, Navbar, Footer)
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── sections/           # Reusable page sections (Hero, CTA, FAQ, Stats, Testimonial, dll)
│   │   ├── layout/             # Navbar, Footer, ServicePageLayout
│   │   ├── blog/               # BlogCard, BlogDetailClient, PostEditor, TableOfContents
│   │   ├── content-map/        # Content map visual editor nodes
│   │   └── ui/                 # Shared UI (Logo, BlobDecoration, CursorSpotlight, dll)
│   ├── lib/
│   │   ├── api/                # API client functions (admin, blog, content-map, portfolio)
│   │   ├── data/               # Static data fetchers (blog, services)
│   │   ├── seo/                # SEO utilities (checker, site config)
│   │   └── utils.ts            # Shared utilities
│   └── middleware.ts           # Next.js middleware (auth redirect, etc)
├── backend/
│   ├── app/
│   │   ├── core/               # Config, database, security (JWT+bcrypt), utils
│   │   ├── models/             # SQLAlchemy models (User, Article, Portfolio, dll)
│   │   ├── routers/            # FastAPI routers (12 endpoint groups)
│   │   ├── schemas/            # Pydantic schemas
│   │   └── main.py             # FastAPI app entry point
│   ├── deploy/                 # WSGI adapter untuk Passenger
│   ├── scripts/                # Seed scripts
│   ├── public/uploads/         # Uploaded images
│   ├── main.py                 # Backend root → delegates to app.main
│   ├── passenger_wsgi.py       # Passenger entry point
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Credentials (GITIGNORED — never commit)
├── public/                     # Static assets (Next.js)
├── CLAUDE.md                   # File ini
├── README.md                   # Project overview
├── TEMANUMKMKITA_BACKLOG.md    # Historical backlog (arsip)
├── BACKEND_OPTIMIZATION.md     # Backend optimization docs
├── next.config.mjs             # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # NPM dependencies
```

---

## Development Commands

### Frontend

```bash
npm install          # Install dependencies
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

### Backend

```bash
cd backend
pip install -r requirements.txt   # Install deps
uvicorn app.main:app --reload     # Dev server (localhost:8000)
```

---

## Environment Variables

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://api.temanumkmkita.com
```

### Backend (`backend/.env` — NEVER COMMIT)

```
DATABASE_URL=mysql+pymysql://user:pass@host:port/dbname
SECRET_KEY=hex-string-64-chars
CRM_API_URL=https://kantorteman.example.com/api/
CRM_API_KEY=your-crm-key
```

---

## Backend Deployment (Shared Hosting)

```bash
# 1. Upload file baru
rsync -avz -e "ssh -p PORT" backend/ user@host:~/backend/

# 2. Install dependencies
pip install -r requirements.txt

# 3. Restart Passenger
touch tmp/restart.txt
```

---

## Design System

### Colors

```
--accent:        #f5a700    /* Optimism Yellow */
--brand-dark:    #242423    /* Dark Charcoal */
--bg-canvas:     #fcfaf7    /* Pure Snow */
```

### Tone
Bahasa Indonesia, hangat, membumi, percaya diri — tidak korporat.

---

## Coding Conventions

### TypeScript/React
- Semua komponen pakai TypeScript strict mode
- Gunakan `"use client"` directive hanya untuk komponen interaktif
- Komponen server (RSC) sebisa mungkin untuk SEO
- Framer Motion untuk animasi (bukan CSS transitions)
- Tailwind classes langsung di JSX (jangan pakai CSS modules)

### Python/FastAPI
- Modular imports: `from app.core.database import get_db`
- Tidak import langsung antar router — gunakan shared `app/core/` atau `app/models/`
- Password: bcrypt via `bcrypt` library langsung (NOT passlib — broken di Python 3.13)
- Timestamps: ISO string via `datetime.now(timezone.utc).isoformat()`
- Auth: JWT dengan `python-jose`, scheme `HTTPBearer`

### Naming
- camelCase untuk variabel/fungsi TypeScript
- PascalCase untuk komponen React
- kebab-case untuk file/folder TypeScript
- snake_case untuk Python

---

## Common Pitfalls

1. **Jangan pakai `passlib`** — package ini broken di Python 3.13. Gunakan `bcrypt` langsung.
2. **Jangan hapus `tmp/restart.txt`** — Passenger butuh file ini untuk reload.
3. **Jangan lupa `httpx` di requirements.txt** — digunakan untuk CRM forwarding.
4. **CORS: `api.temanumkmkita.com` TERPISAH dari `temanumkmkita.com`** — whitelist harus include keduanya.
5. **Jangan hardcode API URL di frontend** — gunakan `NEXT_PUBLIC_API_URL`.
6. **Build-time API fetch gagal = 500** — gunakan `force-dynamic` atau error handling di blog routes.

---

## Prioritas Pengembangan

1. Jaga agar **tidak ada breaking change** di production
2. Semua perubahan frontend harus lolos `npm run build`
3. Semua perubahan backend harus lolos import test: `python -c "from app.main import app"`
4. Test login setelah deploy backend
5. Ngebut boleh, tapi jangan abaikan type safety
