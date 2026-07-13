// Plots y = ax^2 + bx + c over a given domain and marks the vertex, axis of
// symmetry, and both intercepts. Fully data-driven from a/b/c (a real
// quadratic, not a schematic shape), so this is reusable for any parabola
// a topic wants to show rather than being a one-off hand-built curve.
const INK = '#1C1F1D';
const CURVE_COLOR = '#1E3A2F';
const MARK_COLOR = '#B08840';

const WIDTH = 300;
const HEIGHT = 260;
const PAD = 32;

export default function ParabolaFigure({ a, b, c, xMin, xMax, yMin, yMax }) {
  const f = (x) => a * x * x + b * x + c;
  const toSvgX = (x) => PAD + ((x - xMin) / (xMax - xMin)) * (WIDTH - 2 * PAD);
  const toSvgY = (y) => HEIGHT - PAD - ((y - yMin) / (yMax - yMin)) * (HEIGHT - 2 * PAD);

  const steps = 40;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    points.push([toSvgX(x), toSvgY(f(x))]);
  }
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');

  const vertexX = -b / (2 * a);
  const vertexY = f(vertexX);
  const discriminant = b * b - 4 * a * c;
  const roots = discriminant >= 0
    ? [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)]
    : [];

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ maxHeight: 280 }}>
      {/* axes */}
      <line x1={PAD} y1={toSvgY(0)} x2={WIDTH - PAD} y2={toSvgY(0)} stroke="#E5E7EB" strokeWidth="1" />
      <line x1={toSvgX(0)} y1={PAD} x2={toSvgX(0)} y2={HEIGHT - PAD} stroke="#E5E7EB" strokeWidth="1" />

      {/* axis of symmetry */}
      <line
        x1={toSvgX(vertexX)} y1={PAD} x2={toSvgX(vertexX)} y2={HEIGHT - PAD}
        stroke={MARK_COLOR} strokeWidth="1.5" strokeDasharray="4 3"
      />

      <path d={path} fill="none" stroke={CURVE_COLOR} strokeWidth="2.5" />

      {/* y-intercept */}
      <circle cx={toSvgX(0)} cy={toSvgY(c)} r="3.5" fill={INK} />
      <text x={toSvgX(0) - 8} y={toSvgY(c) - 8} fontSize="12" fill={INK} textAnchor="end">
        (0, {c})
      </text>

      {/* x-intercepts */}
      {roots.map((r, i) => (
        <g key={i}>
          <circle cx={toSvgX(r)} cy={toSvgY(0)} r="3.5" fill={INK} />
          <text x={toSvgX(r)} y={toSvgY(0) + 16} fontSize="12" fill={INK} textAnchor="middle">
            ({Number(r.toFixed(2))}, 0)
          </text>
        </g>
      ))}

      {/* vertex -- offset well clear of the x-intercept label row instead of
          just above/below the point, since for a vertex near the x-axis the
          two would otherwise collide */}
      <circle cx={toSvgX(vertexX)} cy={toSvgY(vertexY)} r="4" fill={MARK_COLOR} />
      <text
        x={toSvgX(vertexX) + 10}
        y={toSvgY(vertexY) + (vertexY >= 0 ? -34 : 34)}
        fontSize="12"
        fontWeight="600"
        fill={MARK_COLOR}
        textAnchor="start"
      >
        Vertex ({Number(vertexX.toFixed(2))}, {Number(vertexY.toFixed(2))})
      </text>
    </svg>
  );
}
