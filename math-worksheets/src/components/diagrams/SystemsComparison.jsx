// Renders 2-3 small side-by-side coordinate planes, each showing the line(s)
// for one "solution type" case (one solution / no solution / infinitely many),
// so the algebraic classification in the concept summary maps directly onto
// what the lines actually look like. Straight lines are drawn exactly from
// slope/intercept rather than sampled, since there's no curvature to capture.
const X_MIN = -3;
const X_MAX = 3;
const Y_MIN = -5;
const Y_MAX = 9;
const SIZE = 140;
const PAD = 10;

function toSvgX(x) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SIZE - 2 * PAD);
}
function toSvgY(y) {
  return SIZE - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SIZE - 2 * PAD);
}

export default function SystemsComparison({ cases = [] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {cases.map((c, i) => (
        <div key={i} className="flex flex-col items-center">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full">
            <line
              x1={PAD} y1={toSvgY(0)} x2={SIZE - PAD} y2={toSvgY(0)}
              stroke="#E5E7EB" strokeWidth="1"
            />
            <line
              x1={toSvgX(0)} y1={PAD} x2={toSvgX(0)} y2={SIZE - PAD}
              stroke="#E5E7EB" strokeWidth="1"
            />
            {c.lines.map((line, j) => (
              <line
                key={j}
                x1={toSvgX(X_MIN)}
                y1={toSvgY(line.slope * X_MIN + line.intercept)}
                x2={toSvgX(X_MAX)}
                y2={toSvgY(line.slope * X_MAX + line.intercept)}
                stroke={line.color}
                strokeWidth="2.5"
                strokeDasharray={line.dash ? '5 3' : undefined}
              />
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
