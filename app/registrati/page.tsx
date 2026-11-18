"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, emailFor, type Avatar } from "@/lib/supabase";
import { BRAND_COLORS, CREATURES } from "@/components/Elf";

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const randomAvatar = (): Avatar => ({
  creature: pick(CREATURES).id as Avatar["creature"],
  sex: Math.random() < 0.5 ? "m" : "f",
  color: pick(BRAND_COLORS).hex,
  hair: 0, hairColor: "#f2e8d5", face: 0, hat: 0,
});

export default function Register() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const nick = nickname.trim();
    if (nick.length < 2 || nick.length > 30) return setError("Scrivi il tuo nome (da 2 a 30 caratteri), così i colleghi ti riconoscono!");
    if (password.length < 6) return setError("Servono almeno 6 caratteri: Babbo Natale non accetta password troppo corte.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: emailFor(nick),
      password,
      options: { data: { nickname: nick, avatar: randomAvatar() } },
    });
    setBusy(false);
    if (error) {
      if (error.message.includes("registered")) return setError("Questo nome è già iscritto: sei già dentro? Torna indietro ed entra! Se siete in due con lo stesso nome, aggiungi l'iniziale del cognome.");
      if (error.message.includes("Database error")) return setError("Le iscrizioni sono chiuse: gli abbinamenti sono già stati fatti. Scrivi all'organizzatrice!");
      return setError("Il registro degli elfi si è inceppato, riprova!");
    }
    router.replace("/");
  }

  return (
    <main className="page" style={{ paddingTop: 16, paddingBottom: 20, justifyContent: "center", position: "relative" }}>
      <button type="button" className="btn secondary back" style={{ position: "absolute", top: "calc(12px + env(safe-area-inset-top))", left: "50%", transform: "translateX(-50%)" }} onClick={() => router.push("/login")}>← Indietro</button>
      <form className="stack" onSubmit={submit} style={{ textAlign: "center" }}>
        <h2>Iscriviti al Babbo Natale segreto</h2>
        <input placeholder="Il tuo nome (es. Marco R.)" value={nickname} onChange={(e) => setNickname(e.target.value)} required autoComplete="name" />
        <input type="password" placeholder="Scegli una password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>Partecipo!</button>
        <p className="fine">Ti assegniamo un personaggio a sorpresa: lo cambi quando vuoi dal tuo profilo.</p>
      </form>
    </main>
  );
}
