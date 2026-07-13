const INK = '#1C1F1D';
const LINE_COLOR = '#1E3A2F';

// Generic scalene triangle with a label at each vertex (an angle value or
// "?" for the unknown), for angle-sum problems that don't fit the
// right-triangle or transversal figures already covered elsewhere.
export default function TriangleAngles({ angleA = '?', angleB = '?', angleC = '?' }) {
  const A = [70, 190];
  const B = [270, 190];
  const C = [150, 40];

  return (
    <svg viewBox="0 0 340 220" className="w-full" style={{ maxHeight: 240 }}>
      <polygon
        points={`${A.join(',')} ${B.join(',')} ${C.join(',')}`}
        fill="none"
        stroke={LINE_COLOR}
        strokeWidth="2.5"
      />
      <text x={A[0] - 14} y={A[1] + 6} fontSize="14" fontWeight="600" fill={INK} textAnchor="end">
        {angleA}
      </text>
      <text x={B[0] + 14} y={B[1] + 6} fontSize="14" fontWeight="600" fill={INK} textAnchor="start">
        {angleB}
      </text>
      <text x={C[0]} y={C[1] - 12} fontSize="14" fontWeight="600" fill={INK} textAnchor="middle">
        {angleC}
      </text>
    </svg>
  );
}
