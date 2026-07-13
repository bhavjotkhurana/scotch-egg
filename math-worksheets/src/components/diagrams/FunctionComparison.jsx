import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Plots one or more functions (given as plain-JS expression strings in `x`,
// e.g. "x*x" or "-(x*x) + 2") over a shared x-domain, so a concept summary
// can show "here's the base function and here's what happens to it" instead
// of describing the transformation in words alone. The formulas are
// hand-authored by whoever writes the topic content, not user input.
function sampleSeries(fn, xMin, xMax, steps = 60) {
  // eslint-disable-next-line no-new-func
  const evaluate = new Function('x', `return ${fn};`);
  const points = [];
  const step = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * step;
    points.push({ x: Math.round(x * 100) / 100, [fn]: evaluate(x) });
  }
  return points;
}

export default function FunctionComparison({ xMin = -5, xMax = 5, series = [] }) {
  // Merge each series' samples into one array of { x, [seriesLabel]: y, ... }
  // rows, which is what Recharts expects for multiple <Line> series sharing
  // an x-axis.
  const merged = {};
  series.forEach(({ fn }) => {
    sampleSeries(fn, xMin, xMax).forEach(({ x, [fn]: y }) => {
      merged[x] = merged[x] || { x };
      merged[x][fn] = y;
    });
  });
  const data = Object.values(merged).sort((a, b) => a.x - b.x);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[xMin, xMax]}
            tick={{ fill: '#6B7280', fontSize: 11 }}
          />
          <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
          <Tooltip labelFormatter={(x) => `x = ${x}`} />
          <Legend
            formatter={(value) => {
              const s = series.find((s) => s.fn === value);
              return <span style={{ color: '#1C1F1D', fontSize: 13 }}>{s?.label || value}</span>;
            }}
          />
          {series.map(({ fn, color, dash }) => (
            <Line
              key={fn}
              type="monotone"
              dataKey={fn}
              stroke={color}
              strokeWidth={2.5}
              strokeDasharray={dash ? '6 4' : undefined}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
