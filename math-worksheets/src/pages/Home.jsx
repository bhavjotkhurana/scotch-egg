import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import WorksheetCard from '@/components/worksheets/WorksheetCard.jsx';
import WorksheetDetailsDialog from '@/components/worksheets/WorksheetDetailsDialog.jsx';
import Seo from '@/components/Seo.jsx';

const categoryFilters = [
  'all',
  'SAT Math',
  'Algebra',
  'Geometry',
  'Calculus',
  'Statistics',
  'Trigonometry',
  'Pre-Algebra',
  'Other',
];

const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = [
  { value: 'a-z', label: 'A → Z' },
  { value: 'z-a', label: 'Z → A' },
  { value: 'difficulty', label: 'Difficulty' },
];
const difficultyRank = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

export default function HomePage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('a-z');
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

  const { data: worksheets = [], isLoading } = useQuery({
    queryKey: ['worksheets'],
    queryFn: () => base44.entities.Worksheet.list('-created_date'),
  });

  const filteredWorksheets = useMemo(() => {
    return worksheets.filter((worksheet) => {
      const categories = worksheet.categories?.length
        ? worksheet.categories
        : worksheet.category
          ? [worksheet.category]
          : [];

      const categoryMatch =
        categoryFilter === 'all' || categories.includes(categoryFilter);

      const difficultyMatch =
        difficultyFilter === 'all' || worksheet.difficulty === difficultyFilter;

      return categoryMatch && difficultyMatch;
    });
  }, [worksheets, categoryFilter, difficultyFilter]);

  const sortedWorksheets = useMemo(() => {
    return [...filteredWorksheets].sort((a, b) => {
      if (sortBy === 'z-a') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'difficulty') {
        const rankA = difficultyRank[a.difficulty] ?? Number.MAX_SAFE_INTEGER;
        const rankB = difficultyRank[b.difficulty] ?? Number.MAX_SAFE_INTEGER;
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return a.title.localeCompare(b.title);
      }
      return a.title.localeCompare(b.title);
    });
  }, [filteredWorksheets, sortBy]);

  return (
    <>
      <Seo
        title="Free Math Worksheets for SAT Prep and Classrooms"
        description="Browse organized SAT and classroom-ready math worksheets by topic, category, and difficulty. Download every worksheet for free and share with students."
        keywords={[
          'free math worksheets',
          'SAT math practice',
          'algebra worksheet download',
          'geometry practice pdf',
          'statistics practice problems',
        ]}
        structuredData={({ canonicalUrl }) => ({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Scotch Egg Math Worksheets',
          url: canonicalUrl,
          description:
            'Always-free SAT and classroom math worksheets across algebra, geometry, statistics, and more with printable practice sets.',
          inLanguage: 'en-US',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${canonicalUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        })}
      />

      <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-primary-dark py-20 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/95 to-brand-primary-dark/95" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Always Free • New Worksheets Regularly</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">Master Math, One Worksheet at a Time</h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-white sm:text-2xl">
            High-quality practice worksheets for SAT prep and beyond. Download for free and share with classmates.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{worksheets.length}</div>
              <div className="text-white">Worksheets</div>
            </div>
            <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">
                {worksheets.reduce((sum, worksheet) => sum + (worksheet.download_count || 0), 0)}
              </div>
              <div className="text-white">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold text-gray-900">Browse Worksheets</h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Difficulty</span>
                <select
                  value={difficultyFilter}
                  onChange={(event) => setDifficultyFilter(event.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm">
                <span className="text-gray-600">Sort</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            {categoryFilters.map((category) => {
              const isActive = categoryFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setCategoryFilter(category)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-brand-secondary/40 hover:text-brand-primary'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-48 w-full rounded-lg bg-gray-200" />
                <div className="mb-2 h-6 w-3/4 rounded bg-gray-200" />
                <div className="mb-4 h-4 w-full rounded bg-gray-200" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded bg-gray-200" />
                  <div className="h-6 w-24 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedWorksheets.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">📝</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No worksheets found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedWorksheets.map((worksheet) => (
              <WorksheetCard key={worksheet.id} worksheet={worksheet} onClick={() => setSelectedWorksheet(worksheet)} />
            ))}
          </div>
        )}
      </section>

      <WorksheetDetailsDialog worksheet={selectedWorksheet} onClose={() => setSelectedWorksheet(null)} />
    </div>
    </>
  );
}
