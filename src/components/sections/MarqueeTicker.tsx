const items = [
  "Jadikan bisnismu mudah ditemukan",
  "Website yang bekerja 24/7 untukmu",
  "Konsultasi gratis, tanpa tekanan",
  "Dari zero ke halaman pertama Google",
  "Sosial media yang tumbuh konsisten",
  "120+ bisnis sudah percaya kami",
  "Desain logo yang berkesan & profesional",
  "Maintenance website tanpa pusing teknikal",
  "UMKM lokal, dampak digital global",
];

export default function MarqueeTicker() {
  const repeated = [...items, ...items];

  return (
    <div className="py-3.5 bg-accent overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8 text-white font-semibold text-sm">
            <span className="w-1 h-1 rounded-full bg-white/60 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
