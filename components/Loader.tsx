// Caricamento a tema natalizio: una fila di lucine che si accendono una dopo l'altra.
const COLORS = ["#e1434b", "#6ccb8d", "#f3d47b", "#dfa3b4", "#f1eed6", "#6ccb8d", "#e1434b"];

export default function Loader({ label = "Caricamento" }: { label?: string }) {
  return (
    <div className="loader" role="status" aria-label={label}>
      <div className="loader-bulbs">
        {COLORS.map((c, i) => (
          <svg key={i} viewBox="-10 -1 20 38" style={{ ["--c" as string]: c, animationDelay: `${i * 0.15}s` }} aria-hidden="true">
            <rect x="-3.2" y="-1" width="6.4" height="8" rx="1.5" fill="#14241a" />
            <path d="M0,6 C-10,15 -8,29 0,35 C8,29 10,15 0,6Z" fill={c} />
            <ellipse cx="-3" cy="16" rx="1.6" ry="4.5" fill="#fff" opacity="0.4" />
          </svg>
        ))}
      </div>
      <p className="loader-label">{label}</p>
    </div>
  );
}
