"use client";

import type { Avatar } from "@/lib/supabase";
import { AVATARS } from "./avatars";

// Avatar: 5 personaggi natalizi (vettori Freepik). Si sceglie solo il personaggio.
// Avatar in immagine (PNG trasparente in public/avatars).
const IMAGES: Record<string, { label: string; src: string }> = { schiaccianoci: { label: "Schiaccianoci", src: "/avatars/schiaccianoci.png" } };
const imgSrc = (k: string, color?: string) => (color && BRAND_COLORS.some((c) => c.hex === color) && color !== BRAND_COLORS[0].hex ? `/avatars/${k}-${color.slice(1)}.png` : IMAGES[k].src);
// Colori brand per gli accessori (stessi della palette dell'app).
export const BRAND_COLORS = [
  { hex: "#e1434b", label: "Rosso" }, { hex: "#427b5c", label: "Verde" }, { hex: "#d9a844", label: "Oro" },
  { hex: "#e9798d", label: "Rosa" }, { hex: "#6ccb8d", label: "Menta" }, { hex: "#3b9a8f", label: "Teal" },
];
// Accessori da ricolorare per personaggio: colore originale -> m (principale), d (scuro), dd (piu scuro), l (chiaro).
const ACC: Record<string, Record<string, "m" | "d" | "dd" | "l">> = {
  elfo_f: { "#c24c42": "m", "#941711": "d", "#d7e1f5": "l" },
  elfo_m: { "#5bb042": "m", "#207911": "d", "#cad4ad": "l" },
  pinguino: { "#b0c200": "m", "#748d00": "d", "#d24f18": "m", "#973918": "d", "#803302": "dd" },
  volpe: { "#d00011": "m" },
  orso: { "#4d9a00": "m", "#4d8100": "d", "#d65674": "l" },
};
const mix = (hex: string, to: number, t: number) => {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return "#" + n.map((v) => Math.round(v + (to - v) * t).toString(16).padStart(2, "0")).join("");
};
function tint(svg: string, key: string, color?: string) {
  const map = ACC[key];
  if (!color || !map) return svg;
  const shade = { m: color, d: mix(color, 0, 0.3), dd: mix(color, 0, 0.45), l: mix(color, 255, 0.6) };
  return svg.replace(/fill="(#[0-9a-f]{6})"/g, (m, c) => (map[c] ? `fill="${shade[map[c]]}"` : m));
}

export const CREATURES = [...Object.entries(AVATARS).map(([id, v]) => ({ id, label: v.label })), ...Object.entries(IMAGES).map(([id, v]) => ({ id, label: v.label }))];
export const DEFAULT_AVATAR: Avatar = { creature: "elfo_f", sex: "f", hair: 0, hairColor: "#f2e8d5", face: 0, hat: 0 };

// Avatar vecchi (elfo/schiaccianoci/renna/grinch): elfo maschio o femmina.
const keyOf = (a?: Partial<Avatar>) => (a?.creature && (AVATARS[a.creature] || IMAGES[a.creature]) ? a.creature : a?.sex === "m" ? "elfo_m" : "elfo_f");

export default function Elf({ avatar, size = 80 }: { avatar?: Partial<Avatar>; size?: number }) {
  const k = keyOf(avatar);
  if (IMAGES[k]) return <img src={imgSrc(k, avatar?.color)} alt={IMAGES[k].label} width={size * 0.9} height={size * 1.1} style={{ objectFit: "contain" }} />;
  const { vb, svg, label } = AVATARS[k];
  return <svg viewBox={vb} width={size} height={size * 1.1} aria-label={label} preserveAspectRatio="xMidYMid meet" dangerouslySetInnerHTML={{ __html: tint(svg, k, avatar?.color) }} />;
}

export function ElfPicker({ value, onChange }: { value: Avatar; onChange: (a: Avatar) => void }) {
  const cur = keyOf(value);
  return (
    <div className="stack">
      <div className="bigav"><Elf avatar={value} size={200} /></div>
      <div className="avatar-grid">
        {CREATURES.map((c) => (
          <button type="button" key={c.id} aria-label={c.label} className={c.id === cur ? "avatar-opt on" : "avatar-opt"} onClick={() => onChange({ ...value, creature: c.id as Avatar["creature"], sex: c.id === "elfo_m" ? "m" : "f" })}>
            <Elf avatar={{ creature: c.id as Avatar["creature"], color: value.color }} size={40} />
          </button>
        ))}
      </div>
      <div className="chips">
        <button type="button" aria-label="Originale" className={!value.color ? "swatch on" : "swatch"} style={{ background: "conic-gradient(#e1434b, #d9a844, #6ccb8d, #3b9a8f, #e9798d, #e1434b)" }} onClick={() => onChange({ ...value, color: undefined })} />
        {BRAND_COLORS.map((c) => (
          <button type="button" key={c.hex} aria-label={c.label} className={c.hex === value.color ? "swatch on" : "swatch"} style={{ background: c.hex }} onClick={() => onChange({ ...value, color: c.hex })} />
        ))}
      </div>
    </div>
  );
}
