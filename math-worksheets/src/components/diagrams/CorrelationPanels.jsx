// Three small side-by-side dot clouds illustrating positive / negative / no
// correlation, so "look for positive, negative, or no correlation" has an
// actual picture to point at instead of just the three words. Plain SVG
// dots rather than three separate Recharts instances, since there's no
// interactivity or axis precision needed here.
const X_MIN = 0;
const X_MAX = 10;
const Y_MIN = 0;
const Y_MAX = 10;
const SIZE = 140;
const PAD = 12;

function toSvgX(x) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SIZE - 2 * PAD);
}
function toSvgY(y) {
  return SIZE - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SIZE - 2 * PAD);
}

export default function CorrelationPanels({ cases = [] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {cases.map((c, i) => (
        <div key={i} className="flex flex-col items-center">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full">
            <line x1={PAD} y1={SIZE - PAD} x2={SIZE - PAD} y2={SIZE - PAD} stroke="#E5E7EB" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={SIZE - PAD} stroke="#E5E7EB" strokeWidth="1" />
            {c.points.map(([x, y], j) => (
              <circle key={j} cx={toSvgX(x)} cy={toSvgY(y)} r="3.5" fill="#1E3A2F" />
            ))}
          </svg>
          <p className="mt-1 text-center text-xs font-semibold leading-snug text-brand-neutral">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}
