const INK = '#1C1F1D';
const AXIS = '#D1D5DB';
const CURVE = '#1E3A2F';
const POINT_FILL = '#B08840';

// Schematic quartic-style curve: rises from the left, crosses straight
// through the x-axis at the first two zeros, then touches and bounces back
// at the third (both ends pointing up). Hand-tuned for this specific
// cross-cross-touch shape rather than a generic curve-fitting engine --
// geometry/schematic figures like this are built one at a time, same as the
// parallel-transversal diagram.
const PATH =
  'M 20 20 C 50 20 70 90 87.5 140 C 100 175 115 190 132.5 190 ' +
  'C 150 190 165 175 177.5 140 C 190 105 205 70 222.5 70 ' +
  'C 250 70 290 100 312.5 140 C 325 140 335 100 350 60 C 360 40 370 25 380 20';

const AXIS_Y = 140;
// x-positions along the drawn curve corresponding to each zero, matched by
// order to the `zeros` prop (left to right).
const ZERO_SVG_X = [87.5, 177.5, 312.5];

export default function PolynomialCurve({ zeros = [] }) {
  return (
    <svg viewBox="0 0 400 220" className="w-full" style={{ maxHeight: 240 }}>
      {/* x-axis */}
      <line x1="10" y1={AXIS_Y} x2="390" y2={AXIS_Y} stroke={AXIS} strokeWidth="1.5" />

      {/* curve */}
      <path d={PATH} fill="none" stroke={CURVE} strokeWidth="2.5" />

      {/* zero markers + labels */}
      {zeros.map((zero, i) => (
        <g key={i}>
          <circle cx={ZERO_SVG_X[i]} cy={AXIS_Y} r="4" fill={POINT_FILL} />
          <text x={ZERO_SVG_X[i]} y={AXIS_Y + 22} textAnchor="middle" fontSize="13" fontWeight="600" fill={INK}>
            {zero.label ?? zero.x}
          </text>
        </g>
      ))}
    </svg>
  );
}
