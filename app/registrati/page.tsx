"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, emailFor, type Avatar } from "@/lib/supabase";
import { HAIR_COLORS } from "@/components/Elf";

const pick = (n: number) => Math.floor(Math.random() * n);
const randomAvatar = (): Avatar => ({ sex: pick(2) ? "m" : "f", hair: pick(5), hairColor: HAIR_COLORS[pick(HAIR_COLORS.length)], face: pick(3), hat: pick(3) });

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
      if (error.message.includes("registered")) return setError("Questo nome è già iscritto: sei già dentro? Prova ad entrare! Se siete in due con lo stesso nome, aggiungi l'iniziale del cognome.");
      if (error.message.includes("Database error")) return setError("Le iscrizioni sono chiuse: gli abbinamenti sono già stati fatti. Scrivi all'organizzatrice!");
      return setError("Il registro degli elfi si è inceppato, riprova!");
    }
    router.replace("/");
  }

  return (
    <main className="page">
      <h1 className="ribbon">TB Secret Santa</h1>
      <form className="card stack" onSubmit={submit}>
        <h2>Iscriviti</h2>
        <input placeholder="Il tuo nome (es. Marco R.)" value={nickname} onChange={(e) => setNickname(e.target.value)} required autoComplete="name" />
        <input type="password" placeholder="Scegli una password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>Partecipo!</button>
        <Link href="/login">Già iscritto? Entra</Link>
      </form>
    </main>
  );
}
