import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// Line graph over labeled categories (months, years, ...) rather than a
// continuous formula -- for tables of real-ish invented data (revenue by
// year, temperature by month) that the prose describes as "the line graph
// below" but only had numbers to show. Supports one or more series sharing
// the same category axis (e.g. two quantities that both rise together).
export default function LineGraph({ xLabel, yLabel, categories = [], series = [] }) {
  const data = categories.map((category, i) => {
    const row = { category };
    series.forEach((s, si) => {
      row[`s${si}`] = s.values[i];
    });
    return row;
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" />
          <XAxis
            dataKey="category"
            tick={{ fill: '#6B7280', fontSize: 11 }}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, fill: '#1C1F1D', fontSize: 12 } : undefined}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 11 }}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#1C1F1D', fontSize: 12 } : undefined}
          />
          <Tooltip />
          {series.length > 1 && (
            <Legend
              formatter={(_, entry) => {
                const s = series[Number(entry.dataKey.replace('s', ''))];
                return <span style={{ color: '#1C1F1D', fontSize: 13 }}>{s?.label}</span>;
              }}
            />
          )}
          {series.map((s, si) => (
            <Line
              key={si}
              type="monotone"
              dataKey={`s${si}`}
              stroke={s.color || '#1E3A2F'}
              strokeWidth={2.5}
              strokeDasharray={s.dash ? '6 4' : undefined}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
