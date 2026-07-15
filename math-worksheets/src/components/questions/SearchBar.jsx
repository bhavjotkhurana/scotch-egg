import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchTopics } from '@/data/questionsIndex.js';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => searchTopics(query), [query]);
  const showResults = focused && query.trim().length > 0;

  function clearQuery() {
    setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 shadow-sm focus-within:border-brand-primary">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search for a topic (e.g. quadratic formula)"
          className="w-full bg-transparent text-sm text-brand-neutral outline-none placeholder:text-gray-400"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
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
