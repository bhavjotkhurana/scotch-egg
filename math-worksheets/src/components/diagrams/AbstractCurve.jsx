const INK = '#1C1F1D';
const AXIS = '#D1D5DB';
const CURVE = '#1E3A2F';
const POINT_FILL = '#B08840';

// A schematic, illustrative curve for "the graph of y = f(x) is shown" style
// questions where the SAT deliberately doesn't give an equation. Not a
// data-accurate plot -- just a generic shape with the one or two points the
// problem actually depends on marked and labeled.
export default function AbstractCurve({ vertex, vertexLabel, opensUpward = true, point, pointLabel }) {
  const width = 320;
  const height = 200;
  const cx = width / 2;
  const cy = height / 2;

  const bend = opensUpward ? 70 : -70;
  const path = `M ${cx - 100} ${cy - bend * 0.3} Q ${cx} ${cy + bend} ${cx + 100} ${cy - bend * 0.3}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 220 }}>
      {/* axes */}
      <line x1="20" y1={cy} x2={width - 20} y2={cy} stroke={AXIS} strokeWidth="1.5" />
      <line x1={cx} y1="15" x2={cx} y2={height - 15} stroke={AXIS} strokeWidth="1.5" />
      <text x={width - 16} y={cy - 6} fontSize="11" fill="#9CA3AF">
        x
      </text>
      <text x={cx + 6} y="22" fontSize="11" fill="#9CA3AF">
        y
      </text>

      {/* curve */}
      <path d={path} fill="none" stroke={CURVE} strokeWidth="2.5" />

      {/* vertex */}
      {vertex && (
        <g>
          <circle cx={cx} cy={cy} r="4.5" fill={POINT_FILL} />
          <text x={cx + 8} y={cy - 8} fontSize="12" fontWeight="600" fill={INK}>
            {vertexLabel || `(${vertex[0]}, ${vertex[1]})`}
          </text>
        </g>
      )}

      {/* optional second labeled point */}
      {point && (
        <g>
          <circle cx={cx + 70} cy={cy - bend * 0.55} r="4.5" fill={POINT_FILL} />
          <text x={cx + 78} y={cy - bend * 0.55 - 8} fontSize="12" fontWeight="600" fill={INK}>
            {pointLabel || `(${point[0]}, ${point[1]})`}
          </text>
        </g>
      )}
    </svg>
  );
}
