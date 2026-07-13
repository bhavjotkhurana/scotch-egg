const INK = '#1C1F1D';
const LINE = '#B08840';
const NODE_FILL = '#F6F1E4';
const NODE_STROKE = '#1E3A2F';

function formatProb(p) {
  return Number.isInteger(p * 100) ? `${p * 100}%` : p;
}

export default function TreeDiagram({ root = 'Start', branches = [] }) {
  const totalLeaves = branches.reduce((sum, b) => sum + (b.children?.length || 1), 0);
  const height = Math.max(160, totalLeaves * 56);
  const width = 480;
  const rootX = 40;
  const midX = 220;
  const leafX = 420;

  let leafCursor = 0;
  const branchNodes = branches.map((branch) => {
    const children = branch.children || [];
    const leafYs = children.map(() => {
      const y = ((leafCursor + 0.5) * height) / totalLeaves;
      leafCursor += 1;
      return y;
    });
    const branchY = leafYs.length ? leafYs.reduce((a, b) => a + b, 0) / leafYs.length : height / 2;
    return { ...branch, y: branchY, children: children.map((c, i) => ({ ...c, y: leafYs[i] })) };
  });

  const rootY = height / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 260 }}>
      {/* edges: root -> branch */}
      {branchNodes.map((branch, i) => (
        <g key={`edge-root-${i}`}>
          <line x1={rootX + 10} y1={rootY} x2={midX - 10} y2={branch.y} stroke={LINE} strokeWidth="1.5" />
          <text
            x={(rootX + midX) / 2}
            y={(rootY + branch.y) / 2 - 6}
            textAnchor="middle"
            fontSize="12"
            fill={INK}
          >
            {formatProb(branch.probability)}
          </text>
        </g>
      ))}

      {/* edges: branch -> leaf */}
      {branchNodes.map((branch, i) =>
        branch.children.map((child, j) => (
          <g key={`edge-${i}-${j}`}>
            <line x1={midX + 10} y1={branch.y} x2={leafX - 10} y2={child.y} stroke={LINE} strokeWidth="1.5" />
            <text
              x={(midX + leafX) / 2}
              y={(branch.y + child.y) / 2 - 6}
              textAnchor="middle"
              fontSize="12"
              fill={INK}
            >
              {formatProb(child.probability)}
            </text>
          </g>
        ))
      )}

      {/* root node */}
      <circle cx={rootX} cy={rootY} r="10" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="1.5" />
      <text x={rootX} y={rootY - 16} textAnchor="middle" fontSize="12" fontWeight="600" fill={INK}>
        {root}
      </text>

      {/* branch nodes */}
      {branchNodes.map((branch, i) => (
        <g key={`node-${i}`}>
          <circle cx={midX} cy={branch.y} r="10" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="1.5" />
          <text x={midX} y={branch.y - 16} textAnchor="middle" fontSize="12" fontWeight="600" fill={INK}>
            {branch.label}
          </text>
        </g>
      ))}

      {/* leaf nodes */}
      {branchNodes.map((branch, i) =>
        branch.children.map((child, j) => (
          <g key={`leaf-${i}-${j}`}>
            <circle cx={leafX} cy={child.y} r="10" fill={NODE_FILL} stroke={NODE_STROKE} strokeWidth="1.5" />
            <text x={leafX + 18} y={child.y + 4} textAnchor="start" fontSize="12" fontWeight="600" fill={INK}>
              {child.label}
            </text>
          </g>
        ))
      )}
    </svg>
  );
}
