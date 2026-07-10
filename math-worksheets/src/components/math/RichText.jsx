import TeX from './TeX.jsx';

function renderSegment(seg, key) {
  switch (seg.type) {
    case 'text':
      return (
        <span key={key}>
          {seg.value.map((run, j) => {
            let node = run.text;
            if (run.bold) node = <strong>{node}</strong>;
            if (run.italic) node = <em>{node}</em>;
            return <span key={j}>{node}</span>;
          })}
        </span>
      );
    case 'inline-math':
      return <TeX key={key} value={seg.value} />;
    case 'display-math':
      return <TeX key={key} value={seg.value} block className="my-2 overflow-x-auto" />;
    case 'list': {
      const ListTag = seg.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={key}
          className={seg.ordered ? 'list-decimal space-y-1 my-2 pl-6' : 'list-disc space-y-1 my-2 pl-6'}
        >
          {seg.items.map((itemSegments, j) => (
            <li key={j}>
              <RichText segments={itemSegments} as="span" />
            </li>
          ))}
        </ListTag>
      );
    }
    default:
      return null;
  }
}

export default function RichText({ segments, as: Tag = 'div', className = '' }) {
  if (!segments || segments.length === 0) return null;
  return <Tag className={className}>{segments.map((seg, i) => renderSegment(seg, i))}</Tag>;
}
