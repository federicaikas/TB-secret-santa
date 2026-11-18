"use client";
import { useEffect } from "react";

const COLORS = ["#fffaf0", "#f5eedb", "#dfa3b4", "#ffffff"];
const MAX = 40;

// Stelline luccicanti che si accendono dove passa il mouse (o dove si tocca).
// Solo DOM + CSS, nessuna libreria. Rispetta "riduci animazioni".
export default function Sparkles() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lx = -100, ly = -100, lt = 0;

    const spawn = (x: number, y: number) => {
      if (document.querySelectorAll(".sparkle").length >= MAX) return;
      const s = document.createElement("span");
      const size = 10 + Math.random() * 16;
      s.className = "sparkle";
      s.style.cssText = `left:${x + (Math.random() - 0.5) * 20}px;top:${y + (Math.random() - 0.5) * 20}px;width:${size}px;height:${size}px;background:${COLORS[Math.floor(Math.random() * COLORS.length)]};animation-duration:${500 + Math.random() * 500}ms`;
      s.addEventListener("animationend", () => s.remove());
      document.body.appendChild(s);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lt < 50 || Math.hypot(e.clientX - lx, e.clientY - ly) < 22) return;
      lt = now; lx = e.clientX; ly = e.clientY;
      spawn(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      for (let i = 0; i < 3; i++) spawn(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);
  return null;
}
