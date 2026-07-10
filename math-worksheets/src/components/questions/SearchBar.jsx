import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchTopics } from '@/data/questionsIndex.js';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => searchTopics(query), [query]);
  const showResults = focused && query.trim().length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-primary">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for a topic (e.g. quadratic formula)"
          className="w-full bg-transparent text-sm text-brand-neutral outline-none placeholder:text-gray-400"
        />
      </div>

      {showResults && (
        <div className="absolute z-10 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No topics match "{query}"</p>
          ) : (
            results.map(({ unit, topic }) => (
              <Link
                key={`${unit.unitSlug}-${topic.topicSlug}`}
                to={`/practice/${unit.unitSlug}/${topic.topicSlug}`}
                className="block px-4 py-2.5 hover:bg-brand-cream/50"
              >
                <p className="text-sm font-medium text-brand-neutral">{topic.topicTitle}</p>
                <p className="text-xs text-gray-500">{unit.unitTitle}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
