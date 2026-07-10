export default function ProgressBadge({ doneCount = 0, total = 0, className = '' }) {
  if (total === 0) return null;
  const complete = doneCount >= total;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        complete
          ? 'bg-brand-primary text-white'
          : doneCount > 0
            ? 'bg-brand-secondary/40 text-brand-primary-dark'
            : 'bg-gray-100 text-gray-500'
      } ${className}`}
    >
      {doneCount}/{total} done
    </span>
  );
}
