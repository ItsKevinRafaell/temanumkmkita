# Teman UMKM Kita - Content SEO Plan 2026-2027

Updated: 2026-06-10 WIB.
Execution window: 2026-07 sampai 2027-06.
Cadence utama: 10 artikel per bulan, draft per batch bulanan, publish editorial Senin-Rabu-Jumat.

Dokumen ini adalah pegangan taxonomy, pillar map, dan workflow produksi konten 1 tahun. Source of truth kalender 120 topik ada di `backend/scripts/content_calendar_2026_2027.py`. Full draft batch yang sudah tersedia ada di `backend/scripts/content_batches/`.

## Prinsip SEO

Rujukan kerja:
- Google Search Central: helpful, reliable, people-first content.
- Google Search Central: SEO starter guide.
- Google Search Central: structured data guidelines.
- Google Business Profile Help: local ranking memakai relevance, distance, prominence.

Implikasi untuk Teman UMKM Kita:
- Konten harus menjawab masalah UMKM secara praktis, bukan artikel generik.
- Setiap artikel harus punya contoh audit, checklist, skenario UMKM, atau decision framework.
- Setiap artikel draft harus punya SEO metadata, FAQ/HowTo, CTA, image prompt, alt text, dan sumber.
- Automation dipakai untuk seed draft. Publish tetap manual lewat review admin.
- Target panjang artikel: 900-1.300 kata per draft.

## Positioning Konten

Brand voice:
- Hangat, membumi, percaya diri.
- Bahasa Indonesia natural.
- Tidak terlalu korporat.
- Tidak menggurui UMKM.
- Fokus pada keputusan praktis: apa yang harus dicek, dipilih, ditunda, atau diperbaiki.

Core message:
- "Bisnis bagus bisa kalah bukan karena produknya jelek, tapi karena tidak terlihat dan tidak cukup dipercaya saat pelanggan membandingkan."

Audience utama:
- Pemilik UMKM jasa, retail, F&B, beauty, edukasi, komunitas, dan bisnis lokal.
- Area awal: Kalimantan Timur dan Jabodetabek, tetap relevan nasional.
- Pemilik bisnis yang belum punya tim digital internal.

## Taxonomy Final

| Category | Slug | Fungsi | Target layanan | CTA utama |
|---|---|---|---|---|
| Website | website | Website, landing page, company profile, CMS, UX, form lead | `/layanan/web-development`, `/layanan/web-development-bulanan` | Konsultasi website |
| SEO & Google Maps | seo-google-maps | SEO lokal, Google Business Profile, keyword lokal, review, ranking Maps | `/layanan/seo-google-maps` | Audit Google Maps |
| Sosial Media | sosial-media | Kalender konten, caption, pilar konten, approval, analytics | `/layanan/kelola-sosial-media` | Konsultasi sosmed |
| Branding | branding | Logo, identitas visual, warna, file brand, rebranding ringan | `/layanan/desain-logo` | Konsultasi logo/brand |
| Maintenance | maintenance | Backup, security, uptime, hosting, domain, update website | `/layanan/maintenance` | Cek kondisi website |
| Tips Bisnis | tips-bisnis | Digital trust, audit mandiri, WhatsApp CTA, portofolio, prioritas digital | `/kontak`, `/layanan` | Minta audit gratis |

Backward compatibility:
- Kategori lama `SEO` boleh tetap ada untuk artikel lama.
- Konten baru pakai `SEO & Google Maps`.
- Jangan hapus kategori lama sebelum artikel lama direview.

## Pillar Map

| Pillar | Category | Focus keyword | Target page |
|---|---|---|---|
| Website UMKM | Website | website UMKM | `/layanan/web-development`, `/layanan/web-development-bulanan` |
| SEO Lokal & Google Maps | SEO & Google Maps | SEO Google Maps UMKM | `/layanan/seo-google-maps` |
| Sosial Media UMKM | Sosial Media | kelola sosial media UMKM | `/layanan/kelola-sosial-media` |
| Branding UMKM | Branding | desain logo UMKM | `/layanan/desain-logo` |
| Maintenance Website | Maintenance | maintenance website UMKM | `/layanan/maintenance` |
| Digital Trust & Prioritas Bisnis | Tips Bisnis | digitalisasi UMKM | `/layanan`, `/kontak` |

Distribusi default 10 artikel per bulan:
- Website: 2 artikel.
- SEO & Google Maps: 2 artikel.
- Sosial Media: 2 artikel.
- Branding: 1 artikel.
- Maintenance: 1 artikel.
- Tips Bisnis: 2 artikel.

## Seeder Workflow

Content map:
```bash
cd backend
python scripts/seed_content_map_2026_2027.py --dry-run
python scripts/seed_content_map_2026_2027.py
```

Article draft batch:
```bash
cd backend
python scripts/seed_article_drafts.py --list
python scripts/seed_article_drafts.py --month 2026-07 --dry-run
python scripts/seed_article_drafts.py --month 2026-07
```

Seeder policy:
- Seed hanya bulan yang dipilih.
- Artikel dibuat sebagai `draft`, tidak publish otomatis.
- Jika slug sudah ada, seeder skip dan tidak overwrite edit manual.
- Author otomatis memakai author pertama berdasarkan nama jika ada.
- Pillar otomatis resolve dari nama pillar jika sudah ada.
- `cover_image` dikosongkan; image prompt dan alt text masuk ke draft content notes.

## Standar Artikel

Wajib sebelum publish:
- Category sesuai taxonomy final.
- Author dipilih.
- Cover image final sudah diisi.
- Focus keyword diisi.
- SEO title maksimal 60 karakter jika memungkinkan.
- Meta description 120-160 karakter.
- Excerpt ringkas.
- 900-1.300 kata.
- Minimal 4 H2.
- Minimal 1 FAQ atau HowTo.
- Minimal 1 blok `source` berisi 2-4 sumber resmi/tepercaya.
- Minimal 1 internal link ke halaman layanan.
- Minimal 2 internal link ke artikel lain setelah cluster mulai terisi.
- CTA inline muncul sebelum bagian akhir.
- SEO score editor minimal B, ideal A.

Template artikel draft:
1. Key takeaway.
2. Pembuka masalah nyata UMKM.
3. Kenapa topik penting.
4. Tanda awal yang perlu dicek.
5. Checklist utama.
6. HowTo/cara menerapkan.
7. Kesalahan umum.
8. Contoh skenario UMKM.
9. Cara membaca hasil.
10. CTA.
11. FAQ.
12. Referensi.

## Kalender 120 Topik

Kalender lengkap ada di `backend/scripts/content_calendar_2026_2027.py`.

Ringkasan:
- `2026-07`: 10 topik, full draft tersedia di `content_batches/batch_2026_07.py`.
- `2026-08` sampai `2027-06`: 110 topik planned, siap dipakai untuk content map dan batch generation berikutnya.
- Total: 120 topik planned.

Batch `2026-07` yang sudah tersedia:
1. Checklist Website UMKM Sebelum Pilih Vendor.
2. Cara Agar Bisnis UMKM Muncul di Google Maps.
3. Kalender Konten Instagram UMKM untuk 30 Hari.
4. Ciri Logo UMKM yang Terlihat Profesional.
5. Harga Website UMKM: Apa Saja yang Membuat Biaya Berbeda?
6. Optimasi Google Business Profile untuk Pemula.
7. Cara Pelanggan Menilai Bisnis dari Tampilan Online.
8. Website UMKM Lemot: Penyebab dan Cara Mengeceknya.
9. Ide Konten Promosi UMKM yang Tidak Terasa Memaksa.
10. Audit Digital UMKM: 15 Hal yang Perlu Dicek Bulan Ini.

## Monthly Production Workflow

Minggu terakhir setiap bulan:
1. Generate atau review batch bulan berikutnya.
2. Jalankan dry-run seeder dan cek word count.
3. Seed draft ke staging atau production setelah taxonomy/pillar siap.
4. Review manual di admin CMS.
5. Tambahkan cover image final.
6. Tambahkan internal link ke artikel yang sudah publish.
7. Publish sesuai jadwal editorial.
8. Repurpose ke Instagram/Threads/LinkedIn sebagai 3-5 post pendek per artikel.

## Technical SEO Follow-Up

Tidak wajib sebelum seed draft pertama, tapi sebaiknya masuk sprint terdekat:
- Server-render `/blog` supaya listing artikel dan kategori lebih crawlable.
- Tambah route `/blog/kategori/[slug]`.
- Tambah public pillar hub opsional: `/blog/topik/[slug]`.
- Konsistenkan URL share/canonical ke `https://www.temanumkmkita.com`.
- Tambahkan Search Console tracking review bulanan.
