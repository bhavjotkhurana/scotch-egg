import ScatterPlot from './ScatterPlot.jsx';
import TreeDiagram from './TreeDiagram.jsx';
import AbstractCurve from './AbstractCurve.jsx';
import ParallelTransversal from './ParallelTransversal.jsx';
import PolynomialCurve from './PolynomialCurve.jsx';
import FunctionComparison from './FunctionComparison.jsx';
import SystemsComparison from './SystemsComparison.jsx';
import AngleReferenceFigure from './AngleReferenceFigure.jsx';
import RightTriangleFigure from './RightTriangleFigure.jsx';
import CorrelationPanels from './CorrelationPanels.jsx';
import ParabolaFigure from './ParabolaFigure.jsx';
import BarChart from './BarChart.jsx';
import LineGraph from './LineGraph.jsx';
import TrendLineScatter from './TrendLineScatter.jsx';

const RENDERERS = {
  scatter: ScatterPlot,
  tree: TreeDiagram,
  curve: AbstractCurve,
  'parallel-transversal': ParallelTransversal,
  'polynomial-curve': PolynomialCurve,
  'function-comparison': FunctionComparison,
  'systems-comparison': SystemsComparison,
  'angle-reference': AngleReferenceFigure,
  'right-triangle': RightTriangleFigure,
  'correlation-panels': CorrelationPanels,
  parabola: ParabolaFigure,
  'bar-chart': BarChart,
  'line-graph': LineGraph,
  'trend-line': TrendLineScatter,
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
