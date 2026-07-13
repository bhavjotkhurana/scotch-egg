const INK = '#1C1F1D';
const LINE_COLOR = '#1E3A2F';
const TRANSVERSAL_COLOR = '#B08840';

export default function ParallelTransversal({
  line1Label = 'a',
  line2Label = 'b',
  transversalLabel = 't',
  angle1Expression,
  angle2Expression,
}) {
  const width = 360;
  const height = 240;
  const lineAY = 70;
  const lineBY = 170;
  const lineStartX = 30;
  const lineEndX = 330;

  // Transversal from (110, 20) to (250, 220): crosses line a at (145, 70)
  // and line b at (215, 170), giving the classic "Z" alternate-interior shape.
  const transStart = [110, 20];
  const transEnd = [250, 220];
  const intersectA = [145, lineAY];
  const intersectB = [215, lineBY];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
      {/* parallel line a */}
      <line x1={lineStartX} y1={lineAY} x2={lineEndX} y2={lineAY} stroke={LINE_COLOR} strokeWidth="2" />
      <text x={lineEndX + 6} y={lineAY + 4} fontSize="13" fontWeight="600" fill={INK}>
        {line1Label}
      </text>

      {/* parallel line b */}
      <line x1={lineStartX} y1={lineBY} x2={lineEndX} y2={lineBY} stroke={LINE_COLOR} strokeWidth="2" />
      <text x={lineEndX + 6} y={lineBY + 4} fontSize="13" fontWeight="600" fill={INK}>
        {line2Label}
      </text>

      {/* parallel tick marks (single chevron on each line, same spot) */}
      <g stroke={LINE_COLOR} strokeWidth="1.5" fill="none">
        <path d={`M ${60} ${lineAY - 6} l 8 6 l -8 6`} />
        <path d={`M ${60} ${lineBY - 6} l 8 6 l -8 6`} />
      </g>

      {/* transversal */}
      <line
        x1={transStart[0]}
        y1={transStart[1]}
        x2={transEnd[0]}
        y2={transEnd[1]}
        stroke={TRANSVERSAL_COLOR}
        strokeWidth="2"
      />
      <text x={transEnd[0] + 8} y={transEnd[1] + 4} fontSize="13" fontWeight="600" fill={INK}>
        {transversalLabel}
      </text>

      {/* intersection points */}
      <circle cx={intersectA[0]} cy={intersectA[1]} r="3" fill={INK} />
      <circle cx={intersectB[0]} cy={intersectB[1]} r="3" fill={INK} />

      {/* alternate interior angle labels -- opposite sides of the transversal,
          both in the interior region between the two parallel lines */}
      {angle1Expression && (
        <text x={intersectA[0] - 40} y={intersectA[1] + 28} fontSize="13" fill={INK} textAnchor="middle">
          {angle1Expression}
        </text>
      )}
      {angle2Expression && (
        <text x={intersectB[0] + 40} y={intersectB[1] - 18} fontSize="13" fill={INK} textAnchor="middle">
          {angle2Expression}
        </text>
      )}
    </svg>
  );
}
