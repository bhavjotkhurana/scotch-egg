import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { splitUnitTitle } from '@/data/titleFormat.js';

export default function UnitCard({ unit }) {
  const questionCount = unit.topics.reduce((sum, t) => sum + t.questionCount, 0);
  const { number, name } = splitUnitTitle(unit.unitTitle);

  return (
    <Link
      to={`/practice/${unit.unitSlug}`}
      className="group flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2 text-brand-primary">
        <BookOpen className="h-5 w-5" />
        <span className="text-sm font-medium uppercase tracking-wide">Unit {number}</span>
      </div>
      <h3 className="text-lg font-semibold text-brand-neutral group-hover:text-brand-primary">
        {name}
      </h3>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {unit.topics.length} topic{unit.topics.length === 1 ? '' : 's'}
        </span>
        <span>{questionCount} questions</span>
      </div>
    </Link>
  );
}
