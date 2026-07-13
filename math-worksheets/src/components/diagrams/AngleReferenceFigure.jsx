const INK = '#1C1F1D';
const LINE_COLOR = '#1E3A2F';
const TRANSVERSAL_COLOR = '#B08840';

// Standard numbered reference figure: two parallel lines cut by a
// transversal, angles 1-4 at the top intersection and 5-8 at the bottom,
// both numbered top-left/top-right/bottom-left/bottom-right. This fixed
// numbering is what lets "corresponding", "alternate interior", etc. be
// described in the accompanying prose as pairs of numbers (1&5, 3&6, ...)
// instead of redrawing a separate figure per relationship.
export default function AngleReferenceFigure({
  line1Label = 'a',
  line2Label = 'b',
  transversalLabel = 't',
}) {
  const width = 360;
  const height = 240;
  const lineAY = 70;
  const lineBY = 170;
  const lineStartX = 30;
  const lineEndX = 330;

  const transStart = [110, 20];
  const transEnd = [250, 220];
  const intersectA = [145, lineAY];
  const intersectB = [215, lineBY];

  const numberStyle = { fontSize: 12, fontWeight: 600, fill: INK };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
      <line x1={lineStartX} y1={lineAY} x2={lineEndX} y2={lineAY} stroke={LINE_COLOR} strokeWidth="2" />
      <text x={lineEndX + 6} y={lineAY + 4} fontSize="13" fontWeight="600" fill={INK}>
        {line1Label}
      </text>

      <line x1={lineStartX} y1={lineBY} x2={lineEndX} y2={lineBY} stroke={LINE_COLOR} strokeWidth="2" />
      <text x={lineEndX + 6} y={lineBY + 4} fontSize="13" fontWeight="600" fill={INK}>
        {line2Label}
      </text>

      <g stroke={LINE_COLOR} strokeWidth="1.5" fill="none">
        <path d={`M ${60} ${lineAY - 6} l 8 6 l -8 6`} />
        <path d={`M ${60} ${lineBY - 6} l 8 6 l -8 6`} />
      </g>

      <line
        x1={transStart[0]} y1={transStart[1]} x2={transEnd[0]} y2={transEnd[1]}
        stroke={TRANSVERSAL_COLOR} strokeWidth="2"
      />
      <text x={transEnd[0] + 8} y={transEnd[1] + 4} fontSize="13" fontWeight="600" fill={INK}>
        {transversalLabel}
      </text>

      <circle cx={intersectA[0]} cy={intersectA[1]} r="3" fill={INK} />
      <circle cx={intersectB[0]} cy={intersectB[1]} r="3" fill={INK} />

      {/* angles 1-4 at the top intersection */}
      <text x={intersectA[0] - 22} y={intersectA[1] - 12} textAnchor="middle" {...numberStyle}>1</text>
      <text x={intersectA[0] + 18} y={intersectA[1] - 12} textAnchor="middle" {...numberStyle}>2</text>
      <text x={intersectA[0] - 22} y={intersectA[1] + 24} textAnchor="middle" {...numberStyle}>3</text>
      <text x={intersectA[0] + 18} y={intersectA[1] + 24} textAnchor="middle" {...numberStyle}>4</text>

      {/* angles 5-8 at the bottom intersection */}
      <text x={intersectB[0] - 22} y={intersectB[1] - 12} textAnchor="middle" {...numberStyle}>5</text>
      <text x={intersectB[0] + 18} y={intersectB[1] - 12} textAnchor="middle" {...numberStyle}>6</text>
      <text x={intersectB[0] - 22} y={intersectB[1] + 24} textAnchor="middle" {...numberStyle}>7</text>
      <text x={intersectB[0] + 18} y={intersectB[1] + 24} textAnchor="middle" {...numberStyle}>8</text>
    </svg>
  );
}
