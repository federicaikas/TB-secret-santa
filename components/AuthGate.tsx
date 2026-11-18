"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type Profile } from "@/lib/supabase";
import Nav from "./Nav";
import Tutorial from "./Tutorial";

const ProfileCtx = createContext<{ profile: Profile; reload: () => void } | null>(null);

export const useProfile = () => useContext(ProfileCtx)!;

// Wraps every logged-in page: redirects to /login without a session.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [failed, setFailed] = useState(false);

  async function load() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.replace("/login");
    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
    if (!data) return setFailed(true);
    setProfile(data as Profile);
  }

  useEffect(() => {
    load();
    const { data } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_OUT") router.replace("/login");
    });
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed)
    return (
      <main className="page">
        <div className="card stack">
          <p>Non trovo il tuo profilo: forse la slitta è senza segnale. Controlla la connessione e riprova!</p>
          <button className="btn" onClick={() => { setFailed(false); load(); }}>Riprova</button>
          <button className="btn secondary" onClick={() => supabase.auth.signOut()}>Esci</button>
        </div>
      </main>
    );

  if (!profile) return <main className="page"><p>Gli elfi ci stanno lavorando...</p></main>;

  if (profile.blocked)
    return (
      <main className="page">
        <div className="card">
          <p>Il tuo account è in pausa: sei finito nella lista dei birichini. Scrivi all&apos;organizzatrice!</p>
          <button className="btn" onClick={() => supabase.auth.signOut()}>Esci</button>
        </div>
      </main>
    );

  const closeTutorial = async () => {
    await supabase.from("profiles").update({ tutorial_seen: true }).eq("id", profile.id);
    load();
  };

  return (
    <ProfileCtx.Provider value={{ profile, reload: load }}>
      {!profile.tutorial_seen && <Tutorial onClose={closeTutorial} />}
      <main className="page">{children}</main>
      <Nav />
    </ProfileCtx.Provider>
  );
}
