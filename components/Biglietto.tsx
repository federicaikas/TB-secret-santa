import Elf from "./Elf";
import type { Avatar } from "@/lib/supabase";

// Il biglietto della pescata: sotto la patina c'e' il nome della persona a cui fare il regalo.
export default function Biglietto({ nickname, avatar, budget, event }: { nickname: string; avatar?: Avatar; budget: string; event: string }) {
  return (
    <div className="card stack gold" style={{ alignItems: "center", textAlign: "center" }}>
      <span className="star4" />
      <h2>Il tuo regalo va a...</h2>
      <Elf avatar={avatar} size={110} />
      <p className="title" style={{ fontSize: "2.4rem", margin: 0, overflowWrap: "anywhere" }}>{nickname}</p>
      <p style={{ margin: 0 }}>Un regalino con budget massimo di <b>{budget}</b>, in un pacchetto anonimo.</p>
      <p style={{ margin: 0 }}>🤫 Bocca cucita fino allo scambio: {event}</p>
      <span className="star4" />
    </div>
  );
}
