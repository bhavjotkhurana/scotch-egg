import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function ScatterPlot({ xLabel, yLabel, points = [], outliers = [] }) {
  const data = points.map(([x, y]) => ({ x, y }));
  const outlierData = outliers.map(([x, y]) => ({ x, y }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            label={{ value: xLabel, position: 'insideBottom', offset: -5, fill: '#1C1F1D', fontSize: 12 }}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yLabel}
            label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#1C1F1D', fontSize: 12 }}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value) => value}
            labelFormatter={() => ''}
          />
          <Scatter data={data} fill="#1E3A2F" />
          {outlierData.length > 0 && <Scatter data={outlierData} fill="#B08840" />}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
