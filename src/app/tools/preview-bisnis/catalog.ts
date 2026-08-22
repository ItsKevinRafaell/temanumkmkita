// Catalog helper untuk onboarding /mulai.
// - Industry = {slug, label} datang dari backend GET /api/tools/industries
//   (sumber tunggal 22 industri = backend/app/tools_assets/catalog.py INDUSTRIES).
// - PALETTE_HEX = warna representatif per industri buat gallery card yang RINGAN
//   (bukan render iframe). Di-mirror dari PALETTES catalog.py (index 0 = default:
//   brand gelap + accent terang). Ini data brand statik, aman di-hardcode di FE
//   supaya galeri 22 card ga perlu 22 render / fetch tambahan.

export interface Industry {
  slug: string;
  label: string;
}

// [brandDark, accent] — mirror PALETTES[slug][0] dari catalog.py.
export const PALETTE_HEX: Record<string, [string, string]> = {
  kontraktor: ["#1b3a5b", "#e8a33d"],
  "alat-berat": ["#232a31", "#f5a623"],
  otomotif: ["#171a1f", "#e63946"],
  "jasa-b2b": ["#1a2b40", "#2e86de"],
  properti: ["#1e3a34", "#c8a45c"],
  kesehatan: ["#12463f", "#2ec4b6"],
  hukum: ["#1c2331", "#b08d57"],
  konsultan: ["#1f3a5f", "#3d9970"],
  "konstruksi-kecil": ["#1b3a5b", "#f39c12"],
  percetakan: ["#1a1a2e", "#e94560"],
  "eo-wedding": ["#2d1b2e", "#c9a24b"],
  pendidikan: ["#1a3a5c", "#f5a623"],
  travel: ["#0d3b66", "#f4a261"],
  "laundry-b2b": ["#1a3a5c", "#4ea8de"],
  interior: ["#2b2b2b", "#c8a45c"],
  atk: ["#1a2b40", "#2e86de"],
  "cleaning-b2b": ["#12463f", "#2ec4b6"],
  konveksi: ["#1a1a2e", "#e94560"],
  "toko-bangunan": ["#232a31", "#f5a623"],
  pertanian: ["#1e3a2f", "#8bc34a"],
  ekspedisi: ["#1a2b40", "#f5a623"],
  salon: ["#2d1b3d", "#d4a5c9"],
};

const FALLBACK_PALETTE: [string, string] = ["#22303f", "#f5a700"];

export function paletteFor(slug: string): [string, string] {
  return PALETTE_HEX[slug] ?? FALLBACK_PALETTE;
}

// Fetch daftar industri (sama seperti tool preview-bisnis). Return [] kalau gagal.
export async function fetchIndustries(signal?: AbortSignal): Promise<Industry[]> {
  try {
    const r = await fetch("/api/tools/industries", { signal });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.industries as Industry[]) || [];
  } catch {
    return [];
  }
}
