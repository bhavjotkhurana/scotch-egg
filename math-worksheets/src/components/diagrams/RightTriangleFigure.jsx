const INK = '#1C1F1D';
const LINE_COLOR = '#1E3A2F';
const LABEL_COLOR = '#B08840';

// Schematic right triangle labeled relative to one acute angle (theta),
// so opposite/adjacent/hypotenuse can be pointed at directly instead of
// only described in words next to SOH-CAH-TOA. The angle arc and label
// offsets are computed from the actual vertex geometry (not eyeballed
// pixel coordinates), so the arc lands exactly on the two rays that form
// the angle instead of over/undershooting them.
export default function RightTriangleFigure({ angleLabel = String.fromCharCode(952) }) {
  const A = [60, 50]; // top vertex
  const B = [280, 200]; // theta vertex (bottom-right)
  const C = [60, 200]; // right-angle vertex (bottom-left)
  const rightAngleSize = 16;

  const abLen = Math.hypot(A[0] - B[0], A[1] - B[1]);
  const dirBC = [-1, 0];
  const dirBA = [(A[0] - B[0]) / abLen, (A[1] - B[1]) / abLen];

  const arcR = 26;
  const arcStart = [B[0] + arcR * dirBC[0], B[1] + arcR * dirBC[1]];
  const arcEnd = [B[0] + arcR * dirBA[0], B[1] + arcR * dirBA[1]];

  const bisector = [dirBC[0] + dirBA[0], dirBC[1] + dirBA[1]];
  const bisectorLen = Math.hypot(bisector[0], bisector[1]);
  const bisectorUnit = [bisector[0] / bisectorLen, bisector[1] / bisectorLen];
  const labelDist = arcR + 16;
  const labelPos = [B[0] + labelDist * bisectorUnit[0], B[1] + labelDist * bisectorUnit[1]];

  // hypotenuse label: offset perpendicular to AB, away from the triangle interior
  const hypMid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const abUnit = [(B[0] - A[0]) / abLen, (B[1] - A[1]) / abLen];
  const hypPerp = [abUnit[1], -abUnit[0]];
  const hypLabelPos = [hypMid[0] + 20 * hypPerp[0], hypMid[1] + 20 * hypPerp[1]];

  return (
    <svg viewBox="0 0 340 240" className="w-full" style={{ maxHeight: 260 }}>
      <polygon
        points={`${A.join(',')} ${B.join(',')} ${C.join(',')}`}
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="2.5"
      />

      {/* right angle marker at C */}
      <path
        d={`M ${C[0]} ${C[1] - rightAngleSize} L ${C[0] + rightAngleSize} ${C[1] - rightAngleSize} L ${C[0] + rightAngleSize} ${C[1]}`}
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="1.5"
      />

      {/* angle arc at B (theta), sweeping exactly from ray BC to ray BA */}
      <path
        d={`M ${arcStart[0]} ${arcStart[1]} A ${arcR} ${arcR} 0 0 1 ${arcEnd[0]} ${arcEnd[1]}`}
        fill="none"
        stroke={LABEL_COLOR}
        strokeWidth="1.5"
      />
      <text x={labelPos[0]} y={labelPos[1]} fontSize="15" fontWeight="600" fill={LABEL_COLOR} textAnchor="middle">
        {angleLabel}
      </text>

      {/* side labels, offset far enough that they clear the triangle's edges */}
      <text x={C[0] - 10} y={(A[1] + C[1]) / 2} fontSize="13" fontWeight="600" fill={INK} textAnchor="end">
        opposite
      </text>
      <text x={(C[0] + B[0]) / 2} y={C[1] + 22} fontSize="13" fontWeight="600" fill={INK} textAnchor="middle">
        adjacent
      </text>
      <text
        x={hypLabelPos[0]}
        y={hypLabelPos[1]}
        fontSize="13"
        fontWeight="600"
        fill={INK}
        textAnchor="middle"
      >
        hypotenuse
      </text>
    </svg>
  );
}
