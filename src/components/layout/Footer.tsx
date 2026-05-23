import Link from "next/link";

const layananLinks = [
  { label: "Web Development", href: "/layanan/web-development" },
  { label: "SEO & Google Maps", href: "/layanan/seo-google-maps" },
  { label: "Kelola Sosial Media", href: "/layanan/kelola-sosial-media" },
  { label: "Maintenance Website", href: "/layanan/maintenance-website" },
  { label: "Desain Logo", href: "/layanan/desain-logo" },
];

const companyLinks = [
  { label: "Tentang Kami", href: "/tentang-kami" },
  { label: "Portofolio", href: "/portofolio" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-brand-dark font-black text-sm">T</span>
              </div>
              <span className="font-bold text-white text-sm leading-tight">
                Teman<br />
                <span className="text-accent">UMKM Kita</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Membantu UMKM Indonesia hadir dan berkembang secara digital.
            </p>
            <a
              href="https://wa.me/6289501925395"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-accent text-sm font-semibold hover:text-accent/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              +62 895-0192-5395
            </a>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Layanan</h3>
            <ul className="space-y-2">
              {layananLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Perusahaan</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Hubungi Kami</h3>
            <p className="text-white/60 text-sm mb-3">
              Konsultasi gratis, tanpa syarat. Kami siap bantu UMKM kamu.
            </p>
            <a
              href="https://wa.me/6289501925395?text=Halo%2C+saya+ingin+konsultasi+gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent text-brand-dark font-bold text-sm px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors"
            >
              Konsultasi Gratis
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Teman UMKM Kita. Semua hak dilindungi.
          </p>
          <p className="text-white/40 text-sm">
            <a href="https://temanumkmkita.com" className="hover:text-white/60 transition-colors">
              temanumkmkita.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
