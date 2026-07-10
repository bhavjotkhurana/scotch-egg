import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import RichText from '@/components/math/RichText.jsx';
import { useTopicProgress } from '@/hooks/useTopicProgress.js';

export default function QuestionStepper({ unitSlug, topicSlug, practiceParts }) {
  const flatQuestions = useMemo(() => {
    const flat = [];
    for (const part of practiceParts) {
      for (const question of part.questions) {
        flat.push({
          partLabel: part.partLabel,
          partTitle: part.partTitle,
          partIntro: part.partIntro,
          ...question,
        });
      }
    }
    return flat;
  }, [practiceParts]);

  const total = flatQuestions.length;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const { isDone, markSeen, markDone } = useTopicProgress(unitSlug, topicSlug);

  useEffect(() => {
    setRevealed(false);
  }, [index]);

  useEffect(() => {
    if (total > 0) markSeen(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  if (total === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
        No practice questions are available for this topic yet.
      </p>
    );
  }

  const current = flatQuestions[index];

  function goTo(nextIndex) {
    setIndex(Math.max(0, Math.min(total - 1, nextIndex)));
  }

  function handleReveal() {
    setRevealed(true);
    markDone(index);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {index + 1} of {total}
        </span>
        <span className="rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-medium text-brand-primary-dark">
          {current.partTitle}
        </span>
      </div>

      {current.partIntro && (
        <RichText segments={current.partIntro} className="mb-3 text-brand-neutral" />
      )}

      <RichText segments={current.prompt} className="text-brand-neutral" />

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-brand-neutral disabled:opacity-30 hover:bg-gray-100 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>

        {!revealed ? (
          <button
            type="button"
            onClick={handleReveal}
            className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-dark"
          >
            <Eye className="h-4 w-4" /> Show solution
          </button>
        ) : (
          <span className="text-sm font-medium text-brand-primary">
            {isDone(index) ? 'Marked done' : ''}
          </span>
        )}

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === total - 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-brand-neutral disabled:opacity-30 hover:bg-gray-100 disabled:hover:bg-transparent"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {revealed && (
        <div className="mt-4 rounded-lg bg-brand-cream/60 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary-dark">
            Solution
          </p>
          <RichText segments={current.solution} className="text-brand-neutral" />
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-400">
        Stuck on this one?{' '}
        <Link to="/book" className="text-brand-primary hover:underline">
          Book a session
        </Link>
      </p>
    </div>
  );
}
