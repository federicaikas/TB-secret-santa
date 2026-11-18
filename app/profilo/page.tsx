"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGate, { useProfile } from "@/components/AuthGate";
import { ElfPicker, DEFAULT_AVATAR } from "@/components/Elf";
import { supabase, type Avatar } from "@/lib/supabase";

function Profilo() {
  const { profile, reload } = useProfile();
  const [avatar, setAvatar] = useState<Avatar>({ ...DEFAULT_AVATAR, ...profile.avatar });
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const [how, setHow] = useState<"" | "ios" | "android">("");
  const [prompt, setPrompt] = useState<(Event & { prompt: () => void }) | null>(null);
  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setPrompt(e as Event & { prompt: () => void }); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  async function save() {
    await supabase.from("profiles").update({ avatar }).eq("id", profile.id);
    setSaved(true);
    reload();
  }

  return (
    <>
      <button className="btn secondary back" onClick={() => router.push("/")}>← Indietro</button>
      <h1 className="ribbon">{profile.nickname}</h1>
      <ElfPicker value={avatar} onChange={(a) => { setAvatar(a); setSaved(false); }} />
      <button className="btn" style={{ marginTop: 14 }} onClick={save}>{saved ? "Salvato!" : "Salva avatar"}</button>
      <div className="stack" style={{ marginTop: 10, textAlign: "center" }}>
        <p className="fine" style={{ margin: 0 }}>Installa sul telefono</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn secondary" onClick={() => setHow(how === "ios" ? "" : "ios")}><Dl /> iPhone</button>
          <button className="btn secondary" onClick={() => (prompt ? prompt.prompt() : setHow(how === "android" ? "" : "android"))}><Dl /> Android</button>
        </div>
        {how === "ios" && <p className="fine" style={{ margin: 0 }}>Da Safari tocca Condividi, poi &quot;Visualizza altro&quot;, poi scorri fino a &quot;Aggiungi alla schermata Home&quot;.</p>}
        {how === "android" && <p className="fine" style={{ margin: 0 }}>Da Chrome tocca i tre puntini in alto a destra, poi &quot;Installa app&quot; (oppure &quot;Aggiungi a schermata Home&quot;).</p>}
      </div>
      <button type="button" className="linkbtn" style={{ alignSelf: "center", marginTop: 14, letterSpacing: "0.12em", fontSize: "0.75rem", opacity: 0.7 }} onClick={() => supabase.auth.signOut()}>LOGOUT</button>
    </>
  );
}

// Icona semplice di salvataggio (freccia verso il basso in un vassoio).
const Dl = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-3px" }} aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></svg>
);

export default function Page() {
  return <AuthGate><Profilo /></AuthGate>;
}
