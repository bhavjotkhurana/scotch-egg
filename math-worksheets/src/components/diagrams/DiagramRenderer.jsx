import ScatterPlot from './ScatterPlot.jsx';
import TreeDiagram from './TreeDiagram.jsx';
import AbstractCurve from './AbstractCurve.jsx';
import ParallelTransversal from './ParallelTransversal.jsx';

const RENDERERS = {
  scatter: ScatterPlot,
  tree: TreeDiagram,
  curve: AbstractCurve,
  'parallel-transversal': ParallelTransversal,
};

export default function DiagramRenderer({ diagram }) {
  if (!diagram) return null;

  const Renderer = RENDERERS[diagram.type];
  if (!Renderer) return null;

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
      <Renderer {...diagram} />
    </div>
  );
}
