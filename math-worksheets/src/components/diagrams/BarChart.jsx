import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

// Single- or multi-series (grouped) bar chart, driven by a shared list of
// categories and one or more { label, color, values } series aligned to
// those categories by index. One component covers both a plain bar graph
// (one series) and a side-by-side comparison (e.g. "this year" vs
// "last year" per category).
export default function BarChart({ xLabel, yLabel, categories = [], series = [] }) {
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
        <RechartsBarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: '#6B7280', fontSize: 11 }}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -5, fill: '#1C1F1D', fontSize: 12 } : undefined}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 11 }}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#1C1F1D', fontSize: 12 } : undefined}
          />
          <Tooltip cursor={{ fill: '#F6F1E4' }} />
          {series.length > 1 && (
            <Legend
              formatter={(_, entry) => {
                const s = series[Number(entry.dataKey.replace('s', ''))];
                return <span style={{ color: '#1C1F1D', fontSize: 13 }}>{s?.label}</span>;
              }}
            />
          )}
          {series.map((s, si) => (
            <Bar key={si} dataKey={`s${si}`} fill={s.color || '#1E3A2F'} radius={[3, 3, 0, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
