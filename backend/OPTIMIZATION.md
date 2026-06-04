# Backend Optimization Summary

## What Was Wrong

### 1. Monolithic Flat Structure
Semua model, schema, dan utility ditumpuk di root directory. `models.py` (135 lines) dan `schemas.py` (263 lines) berisi semua entity — susah dinavigasi dan rawan merge conflict.

### 2. Duplikasi `now_iso()` di 7 File
Fungsi `now_iso()` didefinisikan ulang di `articles.py`, `auth.py` (router), `authors.py`, `pillars.py`, `portfolios.py`, `settings.py`, `topics.py`. Copy-paste identik, melanggar DRY.

### 3. `routers/__init__.py` Tidak Lengkap
Hanya mengekspor 6 dari 11 router — `authors`, `contact`, `integration`, `portfolios`, `settings`, `topics` tidak ada di `__all__`. Untungnya `main.py` mengimpor langsung, jadi tidak crash.

### 4. Payload Bloat di List Endpoint
`GET /api/articles` mengembalikan `content` (isi artikel penuh) untuk setiap artikel di halaman list. Bandwidth terbuang sia-sia.

### 5. Event Loop Blocking di Upload
Fungsi sinkron `_to_webp()` dipanggil langsung di dalam `async def upload_image()` — semua request lain terblokir selama konversi gambar.

### 6. Hardcoded Fallback di Config
`SECRET_KEY` fallback ke `"change-me-in-production"` dan `DATABASE_URL` fallback ke `root:password@localhost`. Jika `.env` tidak terbaca, app tetap jalan dengan kredensial lemah.

### 7. File Deployment dan Script Tercampur
`passenger_wsgi.py`, `wsgi_app.py`, dan `seed_admin.py` berserakan di root bersama file aplikasi.

### 8. `CategoryUpdate` di Router, Bukan di Schema
Schema `CategoryUpdate` didefinisikan inline di `routers/categories.py`, tidak konsisten dengan entity lain yang schemanya di `schemas.py`.

---

## What Was Optimized

| Area | Optimization |
|------|-------------|
| **File Structure** | Dipindah ke `app/` dengan domain-driven layout: `core/`, `models/`, `schemas/`, `routers/` |
| **DRY** | Semua `now_iso()` di router dihapus, impor dari `app.core.utils` |
| **Models** | Dipecah 10 file per domain, tambah `relationship()` di `Author` ↔ `Article` |
| **Schemas** | Dipecah 9 file, `CategoryUpdate` dipindah dari router ke schema |
| **List Payload** | `ArticleSummaryOut` tanpa `content` untuk `GET /api/articles` public; admin tetap pakai `ArticleOut` penuh |
| **Upload** | `_to_webp()` dibungkus `await run_in_threadpool()` — tidak blokir event loop |
| **Security** | `SECRET_KEY` dan `DATABASE_URL` wajib di-set via `.env`, app crash explicit kalau kosong |
| **Router exports** | `__init__.py` sekarang mengekspor semua 11 router |
| **Clean root** | `seed_admin.py` → `scripts/`, `wsgi_app.py` + `passenger_wsgi.py` → `deploy/` |
| **Backward compat** | Root `models.py`, `schemas.py`, `auth.py`, `database.py`, `utils.py` tetap ada sebagai shim re-export |

---

## Before / After File Structure

```
BEFORE:                              AFTER:
backend/                             backend/
├── .env                             ├── .env
├── .env.example                     ├── .env.example
├── auth.py                          ├── auth.py              ← shim
├── database.py                      ├── database.py          ← shim
├── main.py                          ├── main.py              ← shim
├── models.py                        ├── models.py            ← shim
├── schemas.py                       ├── schemas.py           ← shim
├── utils.py                         ├── utils.py             ← shim
├── requirements.txt                 ├── requirements.txt
├── seed_admin.py                    ├── passenger_wsgi.py    ← shim
├── passenger_wsgi.py                ├── wsgi_app.py          ← shim
├── wsgi_app.py                      ├── app/
├── routers/                         │   ├── __init__.py
│   ├── __init__.py                  │   ├── main.py
│   ├── articles.py                  │   ├── core/
│   ├── auth.py                      │   │   ├── config.py
│   ├── authors.py                   │   │   ├── database.py
│   ├── categories.py                │   │   ├── security.py
│   ├── contact.py                   │   │   └── utils.py
│   ├── integration.py               │   ├── models/
│   ├── pillars.py                   │   │   ├── __init__.py
│   ├── portfolios.py                │   │   ├── article.py
│   ├── settings.py                  │   │   ├── author.py
│   ├── topics.py                    │   │   ├── category.py
│   └── uploads.py                   │   │   ├── contact.py
├── migrations/                      │   │   ├── integration.py
├── public/                          │   │   ├── pillar.py
│   └── uploads/                     │   │   ├── portfolio.py
                                     │   │   ├── settings.py
                                     │   │   ├── topic.py
                                     │   │   └── user.py
                                     │   ├── schemas/
                                     │   │   ├── __init__.py
                                     │   │   ├── article.py
                                     │   │   ├── auth.py
                                     │   │   ├── author.py
                                     │   │   ├── category.py
                                     │   │   ├── integration.py
                                     │   │   ├── pillar.py
                                     │   │   ├── portfolio.py
                                     │   │   ├── settings.py
                                     │   │   └── topic.py
                                     │   ├── routers/
                                     │   │   ├── __init__.py
                                     │   │   ├── articles.py
                                     │   │   ├── auth.py
                                     │   │   ├── authors.py
                                     │   │   ├── categories.py
                                     │   │   ├── contact.py
                                     │   │   ├── integration.py
                                     │   │   ├── pillars.py
                                     │   │   ├── portfolios.py
                                     │   │   ├── settings.py
                                     │   │   ├── topics.py
                                     │   │   └── uploads.py
                                     │   └── services/        ← (empty, siap untuk business logic)
                                     ├── scripts/
                                     │   └── seed_admin.py
                                     ├── deploy/
                                     │   ├── wsgi_app.py
                                     │   └── passenger_wsgi.py
                                     ├── migrations/
                                     └── public/
                                         └── uploads/
```

---

## Files to Update on Shared Hosting

Saat deploy ke shared hosting (cPanel), **upload seluruh folder `app/`, `scripts/`, `deploy/`** dan **overwrite file shim di root**:

### Upload full (new directories):
```
app/          ← seluruh isi (core/, models/, schemas/, routers/, main.py)
scripts/      ← seed_admin.py        
deploy/       ← wsgi_app.py, passenger_wsgi.py
```

### Overwrite (root shims — ganti isi lama):
```
backend/
├── main.py              ← isi baru: from app.main import app
├── models.py            ← isi baru: from app.models import *
├── schemas.py           ← isi baru: from app.schemas import *
├── auth.py              ← isi baru: logic tetap, tapi tanpa fallback SECRET_KEY
├── database.py          ← isi baru: tanpa fallback DATABASE_URL
├── utils.py             ← isi baru: from app.core.utils import *
├── passenger_wsgi.py    ← isi baru: shim ke deploy/passenger_wsgi.py
├── wsgi_app.py          ← isi baru: shim ke deploy/wsgi_app.py
├── requirements.txt     ← tidak berubah
└── .env.example         ← tidak berubah
```

### Dihapus dari root (sudah pindah ke `app/routers/` atau `scripts/`/`deploy/`):
- `routers/` → hapus seluruh direktori (yang aktif di `app/routers/`)
- `seed_admin.py` → hapus dari root (sudah di `scripts/`)
- `wsgi_app.py` logic asli → sudah di `deploy/wsgi_app.py`
- `passenger_wsgi.py` logic asli → sudah di `deploy/passenger_wsgi.py`

### Langkah deploy:
```bash
# Di shared hosting, dari folder backend/
rsync -av app/ /path/to/backend/app/
rsync -av scripts/ /path/to/backend/scripts/
rsync -av deploy/ /path/to/backend/deploy/
# Overwrite root shim files
rsync -av main.py models.py schemas.py auth.py database.py utils.py passenger_wsgi.py wsgi_app.py /path/to/backend/
# Restart Passenger
touch /path/to/backend/passenger_wsgi.py
```
