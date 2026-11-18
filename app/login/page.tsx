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
    <main className="page" style={{ paddingTop: 16, paddingBottom: 20, justifyContent: "center" }}>
      <h1 className="ribbon title">TB<br />Secret Santa</h1>
      <form className="stack" onSubmit={submit} style={{ textAlign: "center" }}>
        <p style={{ margin: 0, textAlign: "center", fontWeight: 600 }}>Il Babbo Natale segreto di TeleBoario. Se sei già iscritto entra, altrimenti registrati: ci metti dieci secondi!</p>
        <input placeholder="Il tuo nome" value={nickname} onChange={(e) => setNickname(e.target.value)} required autoComplete="name" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p className="error">{error}</p>}
        <div className="authtabs">
          <button className="btn" disabled={busy}>Accedi</button>
          <Link href="/registrati" className="btn secondary">Registrati</Link>
        </div>
        <p className="fine" style={{ textAlign: "center" }}>Password dimenticata? Scrivi all&apos;organizzatrice: te ne dà una nuova in un attimo.</p>
      </form>
    </main>
  );
}
