import Vibrant from "node-vibrant";

// Extracts a palette from a cover URL, filtering near-pure black/white edge pixels.
// node-vibrant downsamples + clusters internally (MMCQ), which is exactly the
// "downsample -> cluster -> pick dominant" pipeline from the spec.
export interface Theme { dominant: string; palette: string[] }

export async function extractTheme(url: string): Promise<Theme> {
  const fallback: Theme = { dominant: "#C4553B", palette: ["#C4553B", "#191D28", "#F3EDE2"] };
  if (!url) return fallback;
  try {
    const p = await Vibrant.from(url).getPalette();
    const picks = ["Vibrant", "Muted", "DarkVibrant", "DarkMuted", "LightVibrant", "LightMuted"]
      .map(k => (p as any)[k]?.hex).filter(Boolean);
    const dominant = p.Vibrant?.hex || p.DarkMuted?.hex || picks[0] || fallback.dominant;
    return { dominant, palette: picks.length ? picks : fallback.palette };
  } catch { return fallback; }
}

export function applyTheme(t: Theme) {
  const s = document.documentElement.style;
  const n = parseInt(t.dominant.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  s.setProperty("--accent", t.dominant);
  s.setProperty("--tint", `rgba(${r},${g},${b},.11)`);
  s.setProperty("--shadow-tint", `rgba(${r},${g},${b},.45)`);
}
