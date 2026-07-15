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
    <div className="relative overflow-hidden bg-accent py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-3 text-sm font-semibold text-white"
          >
            <span className="h-1 w-1 flex-shrink-0 rounded-sm bg-white/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
