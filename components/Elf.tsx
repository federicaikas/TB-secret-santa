"use client";

import type { Avatar } from "@/lib/supabase";

// Temporary elf made of simple shapes; will be replaced by a nicer SVG in the polish phase.
export const HAIR_COLORS = ["#5b3a1e", "#e8b04a", "#c2452d", "#222222", "#f2e8d5"];
export const HAIR_NAMES = ["Corti", "Lunghi", "Ricci", "Codini", "Spettinati"];
export const FACE_NAMES = ["Sorriso", "Felice", "Furbetto"];
export const HAT_NAMES = ["Classico", "Pon pon", "Corona"];
export const DEFAULT_AVATAR: Avatar = { sex: "f", hair: 1, hairColor: HAIR_COLORS[0], face: 0, hat: 0 };

function Hair({ a }: { a: Avatar }) {
  const c = a.hairColor;
  switch (a.hair) {
    case 0: return <path d="M28 46 Q50 30 72 46 L72 52 L28 52 Z" fill={c} />;
    case 1: return <path d="M24 46 Q50 28 76 46 L80 88 L68 88 L68 52 L32 52 L32 88 L20 88 Z" fill={c} />;
    case 2: return <g fill={c}>{[26, 36, 46, 56, 66, 74].map((x) => <circle key={x} cx={x} cy={48} r={7} />)}</g>;
    case 3: return <g fill={c}><path d="M28 46 Q50 30 72 46 L72 52 L28 52 Z" /><circle cx={20} cy={60} r={8} /><circle cx={80} cy={60} r={8} /></g>;
    default: return <path d="M24 52 L30 38 L38 48 L46 34 L54 48 L62 34 L70 48 L76 52 Z" fill={c} />;
  }
}

function Hat({ a }: { a: Avatar }) {
  switch (a.hat) {
    case 0: return <g><path d="M26 46 L50 4 L74 46 Z" fill="#3b7a49" /><rect x="24" y="42" width="52" height="8" rx="4" fill="#f2e8d5" /></g>;
    case 1: return <g><path d="M26 46 Q50 0 74 46 Z" fill="#d05537" /><rect x="24" y="42" width="52" height="8" rx="4" fill="#f2e8d5" /><circle cx="50" cy="12" r="7" fill="#f2e8d5" /></g>;
    default: return <g><path d="M28 46 L28 24 L39 34 L50 18 L61 34 L72 24 L72 46 Z" fill="#fffaf0" /><rect x="26" y="42" width="48" height="6" rx="3" fill="#d05537" /></g>;
  }
}

function Face({ a }: { a: Avatar }) {
  const mouth = ["M42 72 Q50 78 58 72", "M40 70 Q50 82 60 70 Z", "M42 72 Q52 76 58 70"][a.face];
  return (
    <g>
      {a.face === 2 ? <path d="M38 62 L46 62" stroke="#222" strokeWidth="3" strokeLinecap="round" /> : <circle cx="42" cy="62" r="3" fill="#222" />}
      <circle cx="58" cy="62" r="3" fill="#222" />
      <circle cx="36" cy="70" r="4" fill="#dfa3b4" />
      <circle cx="64" cy="70" r="4" fill="#dfa3b4" />
      <path d={mouth} stroke="#222" strokeWidth="2.5" fill={a.face === 1 ? "#d05537" : "none"} strokeLinecap="round" />
      {a.sex === "f" && <path d="M36 57 L34 54 M64 57 L66 54" stroke="#222" strokeWidth="2" strokeLinecap="round" />}
    </g>
  );
}

export default function Elf({ avatar, size = 80 }: { avatar?: Partial<Avatar>; size?: number }) {
  const a = { ...DEFAULT_AVATAR, ...avatar };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Elfo">
      <path d="M22 62 L10 52 L26 56 Z M78 62 L90 52 L74 56 Z" fill="#f6d3b3" />
      <circle cx="50" cy="64" r="26" fill="#f6d3b3" />
      <Hair a={a} />
      <Face a={a} />
      <Hat a={a} />
    </svg>
  );
}

function Pick({ label, value, options, onChange }: { label: string; value: number; options: string[]; onChange: (i: number) => void }) {
  return (
    <div className="pick">
      <span>{label}</span>
      <div className="chips">
        {options.map((o, i) => (
          <button type="button" key={o} className={i === value ? "chip on" : "chip"} onClick={() => onChange(i)}>{o}</button>
        ))}
      </div>
    </div>
  );
}

export function ElfPicker({ value, onChange }: { value: Avatar; onChange: (a: Avatar) => void }) {
  const set = (p: Partial<Avatar>) => onChange({ ...value, ...p });
  return (
    <div className="stack">
      <div style={{ textAlign: "center" }}><Elf avatar={value} size={120} /></div>
      <Pick label="Elfo" value={value.sex === "f" ? 0 : 1} options={["Elfa", "Elfo"]} onChange={(i) => set({ sex: i ? "m" : "f" })} />
      <Pick label="Capelli" value={value.hair} options={HAIR_NAMES} onChange={(i) => set({ hair: i })} />
      <div className="pick">
        <span>Colore</span>
        <div className="chips">
          {HAIR_COLORS.map((c) => (
            <button type="button" key={c} aria-label={c} className={c === value.hairColor ? "swatch on" : "swatch"} style={{ background: c }} onClick={() => set({ hairColor: c })} />
          ))}
        </div>
      </div>
      <Pick label="Faccia" value={value.face} options={FACE_NAMES} onChange={(i) => set({ face: i })} />
      <Pick label="Cappello" value={value.hat} options={HAT_NAMES} onChange={(i) => set({ hat: i })} />
    </div>
  );
}
