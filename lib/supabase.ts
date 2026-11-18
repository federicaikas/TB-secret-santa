import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export type Creature = "elfo_f" | "elfo_m" | "pinguino" | "volpe" | "orso" | "schiaccianoci";

export type Avatar = {
  creature?: Creature; // assente = elfo/elfa in base a sex (avatar vecchi)
  sex: "f" | "m";
  color?: string; // colore degli accessori (cappello, sciarpa): uno dei colori brand; assente = originale
  hair: number; // non piu usato (compatibilita)
  hairColor: string;
  face: number; // espressione 0-3
  hat: number; // non piu usato (compatibilita)
};

export type Profile = {
  id: string;
  nickname: string;
  avatar: Avatar;
  is_admin: boolean;
  blocked: boolean;
  tutorial_seen: boolean;
};

// Nessuna email vera: il nome diventa un indirizzo interno, cosi' basta nome + password.
export function emailFor(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${slug || "x"}@tbsanta.app`;
}
