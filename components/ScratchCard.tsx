"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Gratta e vinci: una patina argentata copre i figli; si gratta col dito o col mouse.
// A circa il 45% grattato la patina sparisce da sola.
export default function ScratchCard({ children, onReveal }: { children: React.ReactNode; onReveal?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const moves = useRef(0);
  const drawing = useRef(false);

  useEffect(() => {
    const w = wrap.current, c = cv.current;
    if (!w || !c) return;
    const { width, height } = w.getBoundingClientRect();
    c.width = Math.round(width); c.height = Math.round(height);
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#d9dce3"); g.addColorStop(0.5, "#a9aebb"); g.addColorStop(1, "#d9dce3");
    ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    ctx.fillStyle = "#5b6070"; ctx.textAlign = "center"; ctx.font = "bold 30px system-ui, sans-serif";
    ctx.fillText("GRATTA QUI ✨", width / 2, height / 2);
  }, []);

  const scratch = useCallback((e: React.PointerEvent) => {
    const c = cv.current!; const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2); ctx.fill();
    if (++moves.current % 12) return;
    // Sample the canvas coarsely to estimate how much is scratched.
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 37) { total++; if (d[i] === 0) clear++; }
    if (clear / total > 0.45) { setRevealed(true); onReveal?.(); }
  }, [onReveal]);

  return (
    <div>
      <div ref={wrap} style={{ position: "relative" }}>
        {children}
        <canvas
          ref={cv}
          onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }}
          onPointerMove={(e) => drawing.current && scratch(e)}
          onPointerUp={() => (drawing.current = false)}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 22,
            touchAction: "none", cursor: "crosshair",
            opacity: revealed ? 0 : 1, pointerEvents: revealed ? "none" : "auto", transition: "opacity 600ms",
          }}
        />
      </div>
    </div>
  );
}
