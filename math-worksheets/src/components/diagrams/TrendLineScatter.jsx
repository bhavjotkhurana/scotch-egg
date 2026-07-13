import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// A scatter of points with a fitted trend line (y = slope*x + intercept)
// drawn through them, and an optional highlighted point (e.g. a
// prediction). Covers "here's a scatterplot with its line of best fit" and
// "here's the line, now predict y at this x" with one component, since
// both are the same picture with different emphasis.
export default function TrendLineScatter({
  xLabel,
  yLabel,
  xMin,
  xMax,
  yMin,
  yMax,
  points = [],
  slope,
  intercept,
  predictedPoint,
}) {
  const scatterData = points.map(([x, y]) => ({ x, y }));
  const lineData = [
    { x: xMin, y: slope * xMin + intercept },
    { x: xMax, y: slope * xMax + intercept },
  ];
  const predictedData = predictedPoint ? [{ x: predictedPoint[0], y: predictedPoint[1] }] : [];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[xMin, xMax]}
            name={xLabel}
            label={{ value: xLabel, position: 'insideBottom', offset: -5, fill: '#1C1F1D', fontSize: 12 }}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[yMin, yMax]}
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#1C1F1D', fontSize: 12 }}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          {scatterData.length > 0 && <Scatter data={scatterData} fill="#1E3A2F" />}
          <Line
            data={lineData}
            dataKey="y"
            stroke="#B08840"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
            legendType="none"
          />
          {predictedData.length > 0 && (
            <Scatter data={predictedData} fill="#B0453E" shape="star" />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
