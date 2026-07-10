import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo.jsx';
import TopicListItem from '@/components/questions/TopicListItem.jsx';
import { getUnitBySlug } from '@/data/questionsIndex.js';
import { splitUnitTitle } from '@/data/titleFormat.js';

export default function UnitTopics() {
  const { unitSlug } = useParams();
  const unit = getUnitBySlug(unitSlug);

  const { number: unitNumber, name: unitName } = splitUnitTitle(unit?.unitTitle ?? '');

  if (!unit) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg text-gray-600">We couldn't find that unit.</p>
        <Link to="/" className="mt-4 inline-block text-brand-primary hover:underline">
          Back to all units
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={unit.unitTitle}
        description={`Free practice questions for ${unit.unitTitle}. Pick a topic to start.`}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary">
          <ArrowLeft className="h-4 w-4" /> All units
        </Link>

        <p className="text-sm font-medium uppercase tracking-wide text-brand-primary">
          Unit {unitNumber}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-neutral">{unitName}</h1>
        <p className="mt-1 text-gray-500">{unit.topics.length} topics</p>

        <div className="mt-6 flex flex-col gap-3">
          {unit.topics.map((topic) => (
            <TopicListItem key={topic.topicSlug} unitSlug={unit.unitSlug} topic={topic} />
          ))}
        </div>
      </div>
    </>
  );
}
