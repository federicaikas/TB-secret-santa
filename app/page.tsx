"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGate, { useProfile } from "@/components/AuthGate";
import Elf from "@/components/Elf";
import { supabase, type Avatar } from "@/lib/supabase";

type Person = { nickname: string; avatar: Avatar };

function Home() {
  const { profile } = useProfile();
  const [people, setPeople] = useState<Person[]>([]);
  const [done, setDone] = useState(false);
  const [budget, setBudget] = useState("10 €");
  const [event, setEvent] = useState("alla cena aziendale di Natale.");

  useEffect(() => {
    supabase.rpc("list_participants").then(({ data }) => setPeople((data as Person[] | null) ?? []));
    supabase.rpc("matching_done").then(({ data }) => setDone(!!data));
    supabase.from("settings").select("key, value").then(({ data }) => {
      const s = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      if (s.budget) setBudget(s.budget);
      if (s.event_text) setEvent(s.event_text);
    });
  }, []);

  return (
    <>
      <h1 className="ribbon">TB Secret Santa</h1>
      <p style={{ textAlign: "center", margin: 0 }}>Ciao {profile.nickname}! Sei dentro 🎅</p>

      {done ? (
        <Link href="/pescata" className="note" style={{ textAlign: "center" }}>
          🎁 L&apos;abbinamento è fatto! Vai a grattare il tuo biglietto
        </Link>
      ) : (
        <div className="note">La scatola magica è ancora aperta: quando l&apos;organizzatrice avvia l&apos;abbinamento, qui sotto compare il tuo biglietto da grattare.</div>
      )}

      <div className="card stack">
        <h2>Le regole</h2>
        <p style={{ margin: 0 }}>🎁 Un solo regalino a testa, budget massimo <b>{budget}</b>.</p>
        <p style={{ margin: 0 }}>🤫 Pacchetti anonimi: siate furtivi più di uno 007!</p>
        <p style={{ margin: 0 }}>🎄 Scambio e rivelazione: {event}</p>
        <p style={{ margin: 0 }}>Nessun obbligo, solo un&apos;occasione simpatica per farci gli auguri.</p>
      </div>

      <div className="card stack">
        <h2>Chi partecipa ({people.length})</h2>
        <div className="chips">
          {people.map((p) => (
            <span key={p.nickname} className="chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Elf avatar={p.avatar} size={28} /> {p.nickname}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return <AuthGate><Home /></AuthGate>;
}
