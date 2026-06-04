# Backend Optimization Summary — Teman UMKM Kita

## What Was Wrong (Before)

### 1. Monolithic Files
- **`models.py`** — 8 model classes jammed into a single 135-line file. Hard to navigate, harder to extend.
- **`schemas.py`** — 10+ Pydantic schemas crammed into a single 263-line file. Every change risked merge conflicts.

### 2. N+1 Query Problem
- `routers/articles.py` fetched authors in a Python `for` loop after getting articles — each article triggered a separate DB query for its author. For 20 articles, that's 21 queries instead of 1.

### 3. No Password Hashing Upgrade Path
- Used HMAC-SHA256 with `SECRET_KEY` as key. No migration path to bcrypt — all passwords would need reset if security was upgraded.

### 4. Duplicated Utility Code
- `now_iso()` defined in 6 different router files. Every file copy-pasted the same 3-line function.

### 5. Mixed Top-Level + Package Structure
- Both flat top-level files (`main.py`, `auth.py`, `database.py`, `models.py`, `schemas.py`, `routers/`) and an `app/` package existed simultaneously. Deployment (`passenger_wsgi.py`) pointed to `wsgi_app.py` but `deploy/wsgi_app.py` pointed to `app.main`. Two parallel code paths.

### 6. Inline Schema in Router
- `ContactFormIn` with 4 validators defined directly inside `routers/contact.py` instead of living with other schemas.

---

## What Was Fixed (After)

### 1. Modular File Structure

**Before:**
```
backend/
├── models.py          ← 8 model classes
├── schemas.py         ← 10+ Pydantic schemas
├── auth.py            ← hashing + JWT + auth dependency
├── database.py        ← engine + session
├── main.py            ← FastAPI app
├── seed_admin.py
├── passenger_wsgi.py
├── wsgi_app.py
└── routers/
    ├── articles.py    ← duplicate now_iso()
    ├── auth.py        ← duplicate now_iso()
    ├── authors.py     ← duplicate now_iso()
    ├── ... (12 files)
```

**After (canonical structure in `app/`):**
```
backend/
├── main.py                    ← delegates to app.main
├── seed_admin.py              ← delegates to scripts/seed_admin.py
├── passenger_wsgi.py          ← delegates to deploy.wsgi_app
├── wsgi_app.py                ← delegates to deploy.wsgi_app
│
├── app/
│   ├── main.py                ← FastAPI app (imports app.*)
│   ├── core/
│   │   ├── config.py          ← SECRET_KEY, DATABASE_URL, CRM env vars
│   │   ├── database.py        ← engine + session
│   │   ├── security.py        ← bcrypt, JWT, require_auth
│   │   └── utils.py           ← now_iso()
│   ├── models/
│   │   ├── article.py         ← Article + ArticleCategory
│   │   ├── author.py          ← Author (with relationship)
│   │   ├── category.py        ← (re-exports from article)
│   │   ├── contact.py         ← ContactSubmission
│   │   ├── integration.py     ← IntegrationToken
│   │   ├── pillar.py          ← ContentPillar
│   │   ├── portfolio.py       ← Portfolio
│   │   ├── settings.py        ← SiteSettings
│   │   ├── topic.py           ← ContentTopic
│   │   ├── user.py            ← User
│   │   └── __init__.py        ← exports all
│   ├── schemas/
│   │   ├── article.py         ← ArticleCreate/Update/Out/Paginated
│   │   ├── author.py          ← AuthorCreate/Update/Out
│   │   ├── auth.py            ← LoginRequest, TokenOut, UserOut
│   │   ├── category.py        ← ArticleCategoryBase/Out
│   │   ├── contact.py         ← ContactFormIn (with validators)
│   │   ├── integration.py     ← IntegrationTokenOut/Create
│   │   ├── pillar.py          ← PillarCreate/Update/Out
│   │   ├── portfolio.py       ← PortfolioCreate/Update/Out
│   │   ├── settings.py        ← SiteSettingsOut/Update
│   │   ├── topic.py           ← TopicCreate/Update/Out
│   │   └── __init__.py        ← exports all
│   └── routers/
│       ├── articles.py        ← uses selectinload(Article.author)
│       ├── auth.py            ← uses verify_and_upgrade_password
│       ├── contact.py         ← imports ContactFormIn from schemas
│       └── ... (12 files)
│
├── deploy/
│   ├── passenger_wsgi.py      ← entry: loads app.main
│   └── wsgi_app.py            ← WSGI→ASGI adapter
│
└── scripts/
    └── seed_admin.py          ← creates first admin user
```

### 2. N+1 Query Fixed
```python
# BEFORE — 1 + N queries
items = q.order_by(...).limit(...).all()
for item in items:
    item.author = db.query(Author).filter(Author.id == item.author_id).first()

# AFTER — 1 query with eager loading
items = q.options(selectinload(Article.author)).order_by(...).limit(...).all()
```

### 3. Transparent Password Upgrade
```python
# BEFORE
def verify_password(plain, hashed):
    return hmac.compare_digest(hash_password(plain), hashed)

# AFTER — bcrypt + legacy fallback with auto-upgrade
def verify_and_upgrade_password(plain, hashed, db_session, user_id):
    if is_legacy_hmac(hashed):
        if valid: auto_upgrade_to_bcrypt(db_session, user_id)
    else:
        return pwd_context.verify(plain, hashed)
```

### 4. Deduplicated Utilities
- `now_iso()` extracted to `app/core/utils.py`, imported by all routers.
- `SETTINGS_ID`, `CRM_API_URL/KEY`, `SECRET_KEY`, `DATABASE_URL` centralized in `app/core/config.py`.
- `ContactFormIn` moved from router to `app/schemas/contact.py`.

### 5. Single Entry Point
- `main.py` → `app.main`
- `wsgi_app.py` → `deploy.wsgi_app` → `app.main`
- `passenger_wsgi.py` → `deploy.wsgi_app` → `app.main`
- No more two parallel code paths.

### 6. Requirements Updated
- Added `passlib[bcrypt]` to `requirements.txt`.

---

## Files to Update on Shared Hosting

When deploying to production (cPanel / shared hosting):

### Replace (upload new version):
```
backend/
├── main.py                    ← changed (delegates to app.main)
├── wsgi_app.py                ← changed (delegates to deploy)
├── passenger_wsgi.py          ← changed (delegates to deploy)
├── seed_admin.py              ← changed (delegates to scripts)
├── requirements.txt           ← changed (added passlib[bcrypt])
├── app/                       ← NEW (entire directory)
├── deploy/                    ← NEW (entire directory)
└── scripts/                   ← NEW (entire directory)
```

### Keep (unchanged):
```
backend/
├── .env                       ← keep (production secrets)
├── public/                    ← keep (uploaded images)
└── migrations/                ← keep (database migrations)
```

### Remove (obsolete):
```
backend/
├── auth.py                    ← NO LONGER NEEDED
├── database.py                ← NO LONGER NEEDED
├── models.py                  ← NO LONGER NEEDED
├── schemas.py                 ← NO LONGER NEEDED
└── routers/*.py               ← OLD VERSIONS (replaced by app/routers/)
```

The old `routers/` directory is still present for backward compatibility but is no longer used by the app entry point. It can be removed after confirming the new `app/` structure works in production.

### After Upload — Run:
```bash
cd ~/temanumkmkita/backend
pip install -r requirements.txt
# Restart the Python app (Passenger)
touch tmp/restart.txt
```
