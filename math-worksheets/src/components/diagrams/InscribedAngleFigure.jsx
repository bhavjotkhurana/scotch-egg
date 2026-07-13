const LINE_COLOR = '#1E3A2F';
const MARK_COLOR = '#B08840';
const INK = '#1C1F1D';

// Illustrates the Inscribed Angle Theorem: a central angle (two radii,
// gold) and the inscribed angle that intercepts the same arc, viewed from
// a point on the opposite (major) arc.
export default function InscribedAngleFigure({ centralAngle = 110, inscribedAngle }) {
  const cx = 150;
  const cy = 150;
  const r = 100;
  const toRad = (d) => (d * Math.PI) / 180;
  const aDeg = -90 - centralAngle / 2;
  const bDeg = -90 + centralAngle / 2;
  const A = [cx + r * Math.cos(toRad(aDeg)), cy + r * Math.sin(toRad(aDeg))];
  const B = [cx + r * Math.cos(toRad(bDeg)), cy + r * Math.sin(toRad(bDeg))];
  const C = [cx, cy + r];

  return (
    <svg viewBox="0 0 300 300" className="w-full" style={{ maxHeight: 300 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE_COLOR} strokeWidth="2" />
      <line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke={MARK_COLOR} strokeWidth="2" />
      <line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke={MARK_COLOR} strokeWidth="2" />
      <line x1={C[0]} y1={C[1]} x2={A[0]} y2={A[1]} stroke={LINE_COLOR} strokeWidth="2" />
      <line x1={C[0]} y1={C[1]} x2={B[0]} y2={B[1]} stroke={LINE_COLOR} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="3" fill={INK} />
      <circle cx={C[0]} cy={C[1]} r="3" fill={INK} />
      <text x={cx} y={cy - 45} fontSize="14" fontWeight="600" fill={MARK_COLOR} textAnchor="middle">
        {centralAngle}°
      </text>
      {inscribedAngle && (
        <text x={C[0]} y={C[1] + 22} fontSize="14" fontWeight="600" fill={LINE_COLOR} textAnchor="middle">
          {inscribedAngle}°
        </text>
      )}
    </svg>
  );
}
