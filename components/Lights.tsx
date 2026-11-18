// Festone di lucine pendenti che si accendono a turno (SVG puro, colori della palette).
const COLORS = ["#e1434b", "#6ccb8d", "#f3d47b", "#dfa3b4", "#d9a844", "#3b9a8f"];
const W = 400;
const wireY = (x: number) => 16 + 9 * Math.sin(x / 34) + 4 * Math.sin(x / 13);

export default function Lights() {
  const pts = Array.from({ length: 81 }, (_, i) => {
    const x = (i * W) / 80;
    return `${i ? "L" : "M"}${x.toFixed(1)},${wireY(x).toFixed(1)}`;
  }).join(" ");
  const bulbs = Array.from({ length: 12 }, (_, i) => {
    const x = 20 + i * 32 + (i % 2) * 4;
    const slope = (wireY(x + 1) - wireY(x - 1)) / 2;
    return { x, y: wireY(x), rot: -Math.atan(slope) * (180 / Math.PI) * 0.6, c: COLORS[i % COLORS.length], delay: ((i * 7) % 12) * 0.1 };
  });
  return (
    <svg className="lights" viewBox={`0 0 ${W} 66`} preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <path d={pts} fill="none" stroke="#14241a" strokeWidth="2.2" strokeLinecap="round" />
      {bulbs.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.rot})`}>
          <rect x="-3.2" y="-1" width="6.4" height="8" rx="1.5" fill="#14241a" />
          <g className="bulb" style={{ ["--c" as string]: b.c, animationDelay: `${b.delay}s` }}>
            <path d="M0,6 C-10,15 -8,29 0,35 C8,29 10,15 0,6Z" fill={b.c} />
            <ellipse cx="-3" cy="16" rx="1.6" ry="4.5" fill="#fff" opacity="0.4" />
          </g>
        </g>
      ))}
    </svg>
  );
}
