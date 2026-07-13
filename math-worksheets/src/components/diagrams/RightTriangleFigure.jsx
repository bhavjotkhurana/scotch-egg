const INK = '#1C1F1D';
const LINE_COLOR = '#1E3A2F';
const LABEL_COLOR = '#B08840';

// Schematic right triangle labeled relative to one acute angle (theta),
// so opposite/adjacent/hypotenuse can be pointed at directly instead of
// only described in words next to SOH-CAH-TOA.
export default function RightTriangleFigure({ angleLabel = String.fromCharCode(952) }) {
  const A = [60, 50]; // top vertex
  const B = [280, 200]; // theta vertex (bottom-right)
  const C = [60, 200]; // right-angle vertex (bottom-left)
  const rightAngleSize = 16;

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

      {/* angle arc at B (theta) */}
      <path
        d={`M ${B[0] - 30} ${B[1]} A 30 30 0 0 1 ${B[0] - 22} ${B[1] - 21}`}
        fill="none"
        stroke={LABEL_COLOR}
        strokeWidth="1.5"
      />
      <text x={B[0] - 40} y={B[1] - 14} fontSize="15" fontWeight="600" fill={LABEL_COLOR}>
        {angleLabel}
      </text>

      {/* side labels */}
      <text x={C[0] - 26} y={(A[1] + C[1]) / 2} fontSize="13" fontWeight="600" fill={INK} textAnchor="middle">
        opposite
      </text>
      <text x={(C[0] + B[0]) / 2} y={C[1] + 22} fontSize="13" fontWeight="600" fill={INK} textAnchor="middle">
        adjacent
      </text>
      <text
        x={(A[0] + B[0]) / 2 + 18}
        y={(A[1] + B[1]) / 2 - 6}
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
