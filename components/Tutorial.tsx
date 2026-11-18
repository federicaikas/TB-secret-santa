"use client";

import { useEffect, useState } from "react";

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
    <path d="M12 21V4M5 11l7-7 7 7" />
  </svg>
);

// 3 schermate al primo accesso. Nella 2 una freccia indica la voce Pescata della barra in basso.
export default function Tutorial({ onClose, admin }: { onClose: () => void; admin?: boolean }) {
  const [i, setI] = useState(0);

  // Le parole tra graffe sono evidenziate (rosa, grassetto, maiuscolo).
  const screens = [
    { title: "Sei dentro!", text: "Sei iscritto al {BABBO NATALE SEGRETO} di TeleBoario. Nessun obbligo: solo un'occasione simpatica per farci gli auguri." },
    { title: "La pescata", tab: "/pescata", text: "Quando l'organizzatrice avvia l'abbinamento, in {PESCATA} gratti il biglietto e scopri a chi devi fare un regalo. Sarà una sola persona, e non sarà la stessa che lo farà a te." },
    { title: "Le regole", text: "Un regalino a testa, con il budget indicato in Home. {PACCHETTI ANONIMI} e bocche cucite: siate furtivi più di uno 007 fino allo scambio!" },
  ];
  const s = screens[i];
  const last = i === screens.length - 1;
  const tabs = admin ? 4 : 3;
  const tabIndex = s.tab === "/pescata" ? 1 : -1;

  // Il menu in basso si alza sopra lo sfondo scuro e la voce indicata si illumina.
  useEffect(() => {
    if (s.tab) document.body.dataset.tut = s.tab; else delete document.body.dataset.tut;
    return () => { delete document.body.dataset.tut; };
  }, [s.tab]);

  return (
    <div className="overlay">
      {tabIndex >= 0 && <div className="pointer down" style={{ bottom: "calc(92px + env(safe-area-inset-bottom))", left: `${((tabIndex + 0.5) / tabs) * 100}%`, marginLeft: -24 }}><Arrow /></div>}
      <div className="card stack" style={{ textAlign: "center", maxWidth: 420, width: "100%" }}>
        <h2 className="tut-title">{s.title}</h2>
        <p style={{ margin: 0 }}>
          {s.text.split(/(\{[^}]+\})/).map((t, k) => (t.startsWith("{") ? <b key={k} className="hl">{t.slice(1, -1)}</b> : t))}
        </p>
        <p style={{ margin: 0 }}>{screens.map((_, j) => (j === i ? "●" : "○")).join(" ")}</p>
        <button className="btn" onClick={() => (last ? onClose() : setI(i + 1))}>{last ? "Iniziamo!" : "Avanti"}</button>
      </div>
    </div>
  );
}
