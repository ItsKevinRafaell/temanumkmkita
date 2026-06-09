import type { HomepageProof } from "@/lib/site-proof";

interface Props {
  proof: HomepageProof;
}

export default function MarqueeTicker({ proof }: Props) {
  const items = [
    `${proof.clientsActive} klien aktif`,
    `${proof.projectsCompleted} proyek terkelola`,
    `Fokus ${proof.primaryServiceAreas}`,
    proof.responseTime,
    "Audit gratis sebelum rekomendasi paket",
    "Harga paket transparan",
  ];
  const repeated = [...items, ...items];

  return (
    <div className="py-3 bg-accent overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-8 text-white font-semibold text-sm">
            <span className="w-1 h-1 rounded-sm bg-white/70 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
