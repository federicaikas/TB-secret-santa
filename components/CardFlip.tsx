"use client";
import { useEffect } from "react";

// Al passaggio del mouse su una card giorno (.day) parte una rotazione completa
// sull'asse verticale. La classe resta finche l'animazione finisce, cosi non sfarfalla.
export default function CardFlip() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element).closest?.(".day");
      if (!el || el.classList.contains("flip")) return;
      if (e.relatedTarget && el.contains(e.relatedTarget as Node)) return;
      el.classList.add("flip");
    };
    const onEnd = (e: AnimationEvent) => {
      (e.target as Element).closest?.(".day")?.classList.remove("flip");
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("animationend", onEnd);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("animationend", onEnd);
    };
  }, []);
  return null;
}
