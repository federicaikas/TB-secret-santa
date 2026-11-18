"use client";

import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import Biglietto from "@/components/Biglietto";
import ScratchCard from "@/components/ScratchCard";
import { supabase, type Avatar } from "@/lib/supabase";

type Mine = { nickname: string; avatar: Avatar } | null;

function Pescata() {
  const [mine, setMine] = useState<Mine | undefined>(undefined);
  const [budget, setBudget] = useState("10 €");
  const [event, setEvent] = useState("alla cena aziendale di Natale.");

  useEffect(() => {
    supabase.rpc("get_my_assignment").then(({ data }) => setMine((data as Mine[] | null)?.[0] ?? null));
    supabase.from("settings").select("key, value").then(({ data }) => {
      const s = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      if (s.budget) setBudget(s.budget);
      if (s.event_text) setEvent(s.event_text);
    });
  }, []);

  if (mine === undefined) return <p>Gli elfi ci stanno lavorando...</p>;

  if (!mine)
    return (
      <>
        <h1 className="ribbon">La mia pescata</h1>
        <div className="card stack" style={{ textAlign: "center" }}>
          <span style={{ fontSize: "3rem" }}>🎩</span>
          <p style={{ margin: 0 }}>La scatola magica è ancora chiusa! Appena l&apos;organizzatrice avvia l&apos;abbinamento, qui comparirà il tuo biglietto da grattare. Pazienza, elfo!</p>
        </div>
      </>
    );

  return (
    <>
      <h1 className="ribbon">La mia pescata</h1>
      <p style={{ textAlign: "center", margin: 0 }}>Gratta, gratta: scopri chi ti è toccato!</p>
      <ScratchCard onReveal={() => {}}>
        <Biglietto nickname={mine.nickname} avatar={mine.avatar} budget={budget} event={event} />
      </ScratchCard>
    </>
  );
}

export default function Page() {
  return <AuthGate><Pescata /></AuthGate>;
}
