import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export type Avatar = {
  sex: "f" | "m";
  hair: number; // 0-4
  hairColor: string;
  face: number; // 0-2
  hat: number; // 0-2
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
