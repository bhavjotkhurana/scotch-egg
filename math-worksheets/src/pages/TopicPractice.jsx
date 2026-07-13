import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo.jsx';
import RichText from '@/components/math/RichText.jsx';
import QuestionStepper from '@/components/questions/QuestionStepper.jsx';
import DiagramRenderer from '@/components/diagrams/DiagramRenderer.jsx';
import { useUnitData, findTopic } from '@/data/questionsData.js';
import { getUnitBySlug } from '@/data/questionsIndex.js';
import { splitTopicTitle } from '@/data/titleFormat.js';

const TABS = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
];

export default function TopicPractice() {
  const { unitSlug, topicSlug } = useParams();
  const unitMeta = getUnitBySlug(unitSlug);
  const { data: unitData, isLoading, isError } = useUnitData(unitSlug);
  const topic = findTopic(unitData, topicSlug);
  const [tab, setTab] = useState('learn');
  const { number: topicNumber, name: topicName } = splitTopicTitle(topic?.topicTitle ?? '');

  if (!unitMeta) {
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
        title={topic ? `${topic.topicTitle} Practice` : unitMeta.unitTitle}
        description={
          topic
            ? `Free practice questions and worked solutions for ${topic.topicTitle}.`
            : `Loading practice questions for ${unitMeta.unitTitle}.`
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to={`/practice/${unitSlug}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" /> {unitMeta.unitTitle}
        </Link>

        {isLoading && <p className="text-gray-500">Loading topic…</p>}
        {isError && <p className="text-red-600">Something went wrong loading this topic.</p>}

        {topic && (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-brand-primary">
              Topic {topicNumber}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-brand-neutral">{topicName}</h1>

            <div className="mt-5 inline-flex rounded-lg bg-gray-100 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-white text-brand-primary-dark shadow-sm'
                      : 'text-gray-500 hover:text-brand-neutral'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'practice' && (
              <section className="mt-6">
                <QuestionStepper
                  unitSlug={unitSlug}
                  topicSlug={topicSlug}
                  practiceParts={topic.practiceParts}
                />
              </section>
            )}

            {tab === 'learn' && (
              <section className="mt-6">
                {topic.conceptSummary.length > 0 && (
                  <div className="space-y-3 text-brand-neutral">
                    {topic.conceptSummary.map((paragraph, i) => (
                      <RichText key={i} segments={paragraph} />
                    ))}
                  </div>
                )}

                {topic.conceptDiagram && (
                  <div className="mt-4">
                    <DiagramRenderer diagram={topic.conceptDiagram} />
                  </div>
                )}

                {topic.coreSkills.length > 0 && (
                  <div className="mt-6 rounded-lg bg-brand-cream/50 p-4">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-primary-dark">
                      Core Skills
                    </h2>
                    <ul className="list-disc space-y-1 pl-5 text-brand-neutral">
                      {topic.coreSkills.map((item, i) => (
                        <li key={i}>
                          <RichText segments={item} as="span" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.examples.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {topic.examples.map((example, i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-4">
                        <h3 className="mb-2 font-semibold text-brand-neutral">{example.title}</h3>
                        <RichText segments={example.body} className="text-brand-neutral" />
                      </div>
                    ))}
                  </div>
                )}

                {topic.keyTakeaways.length > 0 && (
                  <div className="mt-6 rounded-lg bg-brand-cream/50 p-4">
                    <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-primary-dark">
                      Key Takeaways
                    </h2>
                    <ul className="list-disc space-y-1 pl-5 text-brand-neutral">
                      {topic.keyTakeaways.map((item, i) => (
                        <li key={i}>
                          <RichText segments={item} as="span" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setTab('practice')}
                  className="mt-8 flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-primary-dark"
                >
                  Try questions <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
