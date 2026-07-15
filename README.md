# Teman UMKM Kita

**Website company profile + blog CMS** — dibangun dengan Next.js 14, FastAPI, dan MySQL.

[![Production](https://img.shields.io/badge/production-temanumkmkita.com-f5a700)](https://temanumkmkita.com)
[![API](https://img.shields.io/badge/api-api.temanumkmkita.com-242423)](https://api.temanumkmkita.com)

---

## Tentang Project

Teman UMKM Kita adalah platform untuk UMKM Indonesia — menampilkan layanan, portofolio, blog, dan form kontak. Full-stack monorepo dengan frontend Next.js (Vercel) dan backend FastAPI (shared hosting).

### Yang Bisa Dilakukan

- **Pengunjung**: lihat layanan, portofolio, baca blog, kirim kontak form
- **Admin**: kelola artikel, author, kategori, portfolio, settings via admin panel
- **Otomatis**: kontak form forward ke CRM, artikel publish dari Content Generator

### Built by

[Kevin Rafaell](https://github.com/ItsKevinRafaell) • [temanumkmkita.com](https://temanumkmkita.com) • sejak Juni 2025

---

## Tech Stack

| Layer       | Teknologi                                                 |
| ----------- | --------------------------------------------------------- |
| Frontend    | Next.js 14, TypeScript 5, Tailwind CSS 3, Framer Motion   |
| Backend     | FastAPI, SQLAlchemy 2.0, bcrypt, JWT                      |
| Database    | MySQL                                                     |
| Animasiones | Framer Motion (page transitions, scroll reveals, 3D tilt) |
| SEO         | Next.js metadata API, sitemap.xml, robots.txt, Open Graph |
| Hosting     | Frontend: Vercel • Backend: LiteSpeed + Passenger WSGI    |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.13+
- MySQL (local atau remote)

### Frontend

```bash
npm install
cp .env.example .env.local   # edit NEXT_PUBLIC_API_URL
npm run dev                  # http://localhost:3000
```

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env         # edit DATABASE_URL + SECRET_KEY
uvicorn app.main:app --reload  # http://localhost:8000
```

### Build Frontend

```bash
npm run build   # verifikasi semua halaman OK
```

---

## Halaman

| Route                              | Deskripsi                                        |
| ---------------------------------- | ------------------------------------------------ |
| `/`                                | Homepage — hero, stats, layanan, cara kerja, CTA |
| `/tentang-kami`                    | About page                                       |
| `/layanan`                         | Overview semua layanan                           |
| `/layanan/web-development`         | Web dev + paket harga                            |
| `/layanan/web-development-bulanan` | Maintenance bulanan                              |
| `/layanan/seo-google-maps`         | SEO + Google Maps                                |
| `/layanan/kelola-sosial-media`     | Sosmed management                                |
| `/layanan/maintenance`             | Website maintenance                              |
| `/layanan/desain-logo`             | Logo design                                      |
| `/kontak`                          | Contact form + CRM integration                   |
| `/blog`                            | Blog listing                                     |
| `/blog/[slug]`                     | Blog detail + Table of Contents                  |
| `/blog/author/[slug]`              | Author page                                      |
| `/admin`                           | Admin dashboard                                  |
| `/admin/login`                     | Admin login                                      |
| `/admin/posts`                     | Manajemen artikel                                |
| `/admin/authors`                   | Manajemen penulis                                |
| `/admin/categories`                | Manajemen kategori                               |
| `/admin/portfolio`                 | Manajemen portfolio                              |
| `/admin/settings`                  | Site settings (sosmed, kontak)                   |
| `/admin/content-map`               | Visual content pillar + topic editor             |

---

## API Endpoints

| Method   | Route                  | Auth | Deskripsi                   |
| -------- | ---------------------- | ---- | --------------------------- |
| GET      | `/api/articles`        | —    | List artikel published      |
| GET      | `/api/articles/{slug}` | —    | Detail artikel              |
| POST     | `/api/articles`        | JWT  | Buat artikel                |
| PUT      | `/api/articles/{id}`   | JWT  | Update artikel              |
| DELETE   | `/api/articles/{id}`   | JWT  | Hapus artikel               |
| GET/POST | `/api/categories`      | JWT  | Kelola kategori             |
| GET/POST | `/api/authors`         | JWT  | Kelola penulis              |
| GET/POST | `/api/portfolios`      | JWT  | Kelola portfolio            |
| GET/POST | `/api/pillars`         | JWT  | Content pillars             |
| GET/POST | `/api/topics`          | JWT  | Content topics              |
| GET/PUT  | `/api/settings`        | JWT  | Site settings               |
| POST     | `/api/auth/login`      | —    | Login + JWT                 |
| POST     | `/api/auth/register`   | JWT  | Register admin baru         |
| POST     | `/api/upload`          | JWT  | Upload gambar               |
| POST     | `/api/contact`         | —    | Submit kontak → forward CRM |

---

## Project Structure

```
├── src/                      # Next.js frontend
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   │   ├── sections/         # Page sections (Hero, CTA, FAQ, dll)
│   │   ├── layout/           # Navbar, Footer
│   │   ├── blog/             # Blog components + PostEditor
│   │   ├── content-map/      # Visual pillar/topic editor
│   │   └── ui/               # Shared UI elements
│   ├── lib/                  # API clients, data, SEO utils
│   └── middleware.ts         # Auth redirect
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── core/             # Config, DB, security, utils
│   │   ├── models/           # SQLAlchemy models (10 entities)
│   │   ├── routers/          # API route handlers (12 modules)
│   │   ├── schemas/          # Pydantic schemas
│   │   └── main.py           # FastAPI app
│   ├── deploy/               # WSGI adapter for Passenger
│   ├── scripts/              # Seed scripts
│   └── public/uploads/       # Image uploads
├── CLAUDE.md                 # AI agent rules
├── TEMANUMKMKITA_BACKLOG.md  # Arsip backlog
└── BACKEND_OPTIMIZATION.md   # Backend optimization notes
```

---

## Deployment

### Frontend (Vercel)

- **Branch**: `main`
- **Auto-deploy**: setiap push ke `main`
- **Env vars**: `NEXT_PUBLIC_API_URL=https://api.temanumkmkita.com`

### Backend (Shared Hosting)

```bash
# Upload
rsync -avz backend/ user@host:~/backend/

# Install & restart
pip install -r requirements.txt
touch tmp/restart.txt
```

### Perhatian

- **JANGAN commit `backend/.env`** (ada di `.gitignore`)
- Backend pakai Python 3.13 — pastikan shared hosting support
- `passlib` **TIDAK KOMPATIBEL** dengan Python 3.13 — sudah diganti ke `bcrypt>=4.0`

---

## Untuk AI Agents

File [`CLAUDE.md`](CLAUDE.md) berisi aturan lengkap untuk semua AI agents (Claude Code, CommandCode, Codex, Cursor). Wajib dibaca sebelum menulis kode.

---

## Lisensi

Private — [Kevin Rafaell](https://github.com/ItsKevinRafaell)
