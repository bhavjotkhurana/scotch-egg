const LINE_COLOR = '#1E3A2F';
const FILL_COLOR = '#B08840';
const INK = '#1C1F1D';

// A circle with a highlighted sector (pie-slice, radii as boundary) or
// segment (chord as boundary, for "region bounded by a chord and the minor
// arc" problems) at a given central angle, centered at the top of the
// circle so the shaded region reads clearly.
export default function CircleSector({ angle = 45, label, showChord = false }) {
  const cx = 150;
  const cy = 150;
  const r = 100;
  const toRad = (d) => (d * Math.PI) / 180;
  const startDeg = -90 - angle / 2;
  const endDeg = -90 + angle / 2;
  const p1 = [cx + r * Math.cos(toRad(startDeg)), cy + r * Math.sin(toRad(startDeg))];
  const p2 = [cx + r * Math.cos(toRad(endDeg)), cy + r * Math.sin(toRad(endDeg))];
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <svg viewBox="0 0 300 300" className="w-full" style={{ maxHeight: 300 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE_COLOR} strokeWidth="2" />
      <line
        x1={cx} y1={cy} x2={p1[0]} y2={p1[1]}
        stroke={LINE_COLOR} strokeWidth={showChord ? '1' : '2'}
        strokeDasharray={showChord ? '4 3' : undefined}
      />
      <line
        x1={cx} y1={cy} x2={p2[0]} y2={p2[1]}
        stroke={LINE_COLOR} strokeWidth={showChord ? '1' : '2'}
        strokeDasharray={showChord ? '4 3' : undefined}
      />
      {showChord ? (
        <path
          d={`M ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${largeArc} 1 ${p2[0]} ${p2[1]} L ${p1[0]} ${p1[1]} Z`}
          fill={FILL_COLOR}
          fillOpacity="0.3"
          stroke={LINE_COLOR}
          strokeWidth="2"
        />
      ) : (
        <path
          d={`M ${cx} ${cy} L ${p1[0]} ${p1[1]} A ${r} ${r} 0 ${largeArc} 1 ${p2[0]} ${p2[1]} Z`}
          fill={FILL_COLOR}
          fillOpacity="0.3"
        />
      )}
      <circle cx={cx} cy={cy} r="3" fill={INK} />
      {label && (
        <text x={cx} y={cy - 18} fontSize="14" fontWeight="600" fill={INK} textAnchor="middle">
          {label}
        </text>
      )}
    </svg>
  );
}
