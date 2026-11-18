"use client";

import { useState } from "react";

// 3 schermate al primo accesso (e dal Profilo).
export default function Tutorial({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);

  const screens = [
    { icon: "🎅", title: "Sei dentro!", text: "Sei iscritto al Babbo Natale segreto di TeleBoario. Nessun obbligo: solo un'occasione simpatica per farci gli auguri." },
    { icon: "✨", title: "La pescata", text: "Quando l'organizzatrice avvia l'abbinamento, nella sezione \"La mia pescata\" gratti il biglietto e scopri a chi devi fare un regalo. Sarà una sola persona, e non sarà la stessa che lo farà a te." },
    { icon: "🎁", title: "Le regole", text: "Un regalino a testa, con il budget scelto dall'organizzatrice. Pacchetti anonimi e bocche cucite: siate furtivi più di uno 007 fino allo scambio!" },
  ];
  const s = screens[i];
  const last = i === screens.length - 1;

  return (
    <div className="overlay">
      <div className="card stack" style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        <span style={{ fontSize: "3.5rem" }}>{s.icon}</span>
        <h2>{s.title}</h2>
        <p style={{ margin: 0 }}>{s.text}</p>
        <p style={{ margin: 0 }}>{screens.map((_, j) => (j === i ? "●" : "○")).join(" ")}</p>
        <button className="btn" onClick={() => (last ? onClose() : setI(i + 1))}>{last ? "Iniziamo!" : "Avanti, elfo!"}</button>
      </div>
    </div>
  );
}
