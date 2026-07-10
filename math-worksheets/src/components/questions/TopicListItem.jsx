import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProgressSnapshot } from '@/hooks/useTopicProgress.js';
import { splitTopicTitle } from '@/data/titleFormat.js';
import ProgressBadge from './ProgressBadge.jsx';

export default function TopicListItem({ unitSlug, topic }) {
  const { doneCount } = getProgressSnapshot(unitSlug, topic.topicSlug);
  const { number, name } = splitTopicTitle(topic.topicTitle);

  return (
    <Link
      to={`/practice/${unitSlug}/${topic.topicSlug}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-brand-primary/40 hover:bg-brand-cream/40"
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-primary">
          Topic {number}
        </p>
        <p className="truncate text-lg font-medium text-brand-neutral">{name}</p>
        <p className="text-sm text-gray-500">{topic.questionCount} questions</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ProgressBadge doneCount={doneCount} total={topic.questionCount} />
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </Link>
  );
}
