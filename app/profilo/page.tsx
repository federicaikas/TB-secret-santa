"use client";

import { useState } from "react";
import AuthGate, { useProfile } from "@/components/AuthGate";
import { ElfPicker, DEFAULT_AVATAR } from "@/components/Elf";
import Tutorial from "@/components/Tutorial";
import { supabase, type Avatar } from "@/lib/supabase";

function Profilo() {
  const { profile, reload } = useProfile();
  const [avatar, setAvatar] = useState<Avatar>({ ...DEFAULT_AVATAR, ...profile.avatar });
  const [saved, setSaved] = useState(false);
  const [tutorial, setTutorial] = useState(false);

  async function save() {
    await supabase.from("profiles").update({ avatar }).eq("id", profile.id);
    setSaved(true);
    reload();
  }

  return (
    <>
      <h1 className="ribbon">{profile.nickname}</h1>
      <div className="card stack">
        <ElfPicker value={avatar} onChange={(a) => { setAvatar(a); setSaved(false); }} />
        <button className="btn" onClick={save}>{saved ? "Salvato!" : "Salva elfo"}</button>
      </div>
      <button className="btn secondary" onClick={() => setTutorial(true)}>Rivedi il tutorial</button>
      {tutorial && <Tutorial onClose={() => setTutorial(false)} />}
      <button className="btn secondary" onClick={() => supabase.auth.signOut()}>Esci (torna presto!)</button>
    </>
  );
}

export default function Page() {
  return <AuthGate><Profilo /></AuthGate>;
}
