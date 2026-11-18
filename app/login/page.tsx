"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, emailFor } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: emailFor(nickname.trim()), password });
    setBusy(false);
    if (error) return setError("Nome o password sbagliati: capita anche ai migliori elfi.");
    router.replace("/");
  }

  return (
    <main className="page">
      <h1 className="ribbon">TB Secret Santa</h1>
      <form className="card stack" onSubmit={submit}>
        <h2>Entra</h2>
        <input placeholder="Il tuo nome" value={nickname} onChange={(e) => setNickname(e.target.value)} required autoComplete="name" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>Entra</button>
        <p style={{ margin: 0 }}>Password dimenticata? Scrivi all&apos;organizzatrice: te ne dà una nuova in un attimo.</p>
        <Link href="/registrati">Non sei ancora iscritto? Iscriviti</Link>
      </form>
    </main>
  );
}
