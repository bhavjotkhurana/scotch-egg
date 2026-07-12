import { Link } from 'react-router-dom';
import Seo from '@/components/Seo.jsx';
import SearchBar from '@/components/questions/SearchBar.jsx';
import UnitCard from '@/components/questions/UnitCard.jsx';
import { getUnits } from '@/data/questionsIndex.js';

export default function UnitList() {
  const units = getUnits();
  const totalQuestions = units.reduce(
    (sum, unit) => sum + unit.topics.reduce((s, t) => s + t.questionCount, 0),
    0
  );

  return (
    <>
      <Seo
        title="Math Practice & Tutoring"
        description="A free, interactive SAT Math question bank. Pick a topic and start practicing right in your browser, no downloads, no sign-up."
        keywords={['free SAT math practice', 'SAT math questions', 'interactive math practice']}
        structuredData={({ canonicalUrl }) => ({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Scotch Egg SAT Math Question Bank',
          url: canonicalUrl,
          numberOfItems: totalQuestions,
        })}
      />

      <section className="bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark py-14 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Pick a topic. Start practicing.</h1>
          <p className="mx-auto mt-3 max-w-2xl text-brand-cream/90">
            {totalQuestions}+ SAT-style Math questions, organized by topic.
          </p>
          <SearchBar className="mx-auto mt-6 max-w-xl" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <UnitCard key={unit.unitSlug} unit={unit} />
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-neutral">Not sure where to start?</h2>
          <p className="mt-3 text-gray-600">
            If you want help figuring out which topics actually matter for your goals, or you're stuck
            on a specific topic or question, please feel free to reach out.
          </p>
          <Link
            to="/book"
            className="mt-6 inline-flex items-center gap-1 rounded-lg bg-brand-primary px-6 py-3 font-medium text-white hover:bg-brand-primary-dark"
          >
            Book a session
          </Link>
        </div>
      </section>
    </>
  );
}
