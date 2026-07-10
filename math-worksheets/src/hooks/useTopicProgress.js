import { useCallback, useEffect, useState } from 'react';

function storageKey(unitSlug, topicSlug) {
  return `scotchegg:progress:${unitSlug}:${topicSlug}`;
}

function readProgress(unitSlug, topicSlug) {
  try {
    const raw = localStorage.getItem(storageKey(unitSlug, topicSlug));
    if (!raw) return { seen: [], done: [] };
    const parsed = JSON.parse(raw);
    return {
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      done: Array.isArray(parsed.done) ? parsed.done : [],
    };
  } catch {
    return { seen: [], done: [] };
  }
}

function writeProgress(unitSlug, topicSlug, progress) {
  try {
    localStorage.setItem(storageKey(unitSlug, topicSlug), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, quota), progress just won't persist.
  }
}

// Plain (non-hook) snapshot reader for list views that just need a count,
// without subscribing to live updates.
export function getProgressSnapshot(unitSlug, topicSlug) {
  const { seen, done } = readProgress(unitSlug, topicSlug);
  return { seenCount: seen.length, doneCount: done.length };
}

export function useTopicProgress(unitSlug, topicSlug) {
  const [progress, setProgress] = useState(() => readProgress(unitSlug, topicSlug));

  useEffect(() => {
    setProgress(readProgress(unitSlug, topicSlug));
  }, [unitSlug, topicSlug]);

  const markSeen = useCallback(
    (index) => {
      setProgress((prev) => {
        if (prev.seen.includes(index)) return prev;
        const next = { ...prev, seen: [...prev.seen, index] };
        writeProgress(unitSlug, topicSlug, next);
        return next;
      });
    },
    [unitSlug, topicSlug]
  );

  const toggleDone = useCallback(
    (index) => {
      setProgress((prev) => {
        const alreadyDone = prev.done.includes(index);
        const done = alreadyDone ? prev.done.filter((i) => i !== index) : [...prev.done, index];
        const next = { ...prev, done };
        writeProgress(unitSlug, topicSlug, next);
        return next;
      });
    },
    [unitSlug, topicSlug]
  );

  const reset = useCallback(() => {
    const empty = { seen: [], done: [] };
    writeProgress(unitSlug, topicSlug, empty);
    setProgress(empty);
  }, [unitSlug, topicSlug]);

  return {
    seenCount: progress.seen.length,
    doneCount: progress.done.length,
    isSeen: (index) => progress.seen.includes(index),
    isDone: (index) => progress.done.includes(index),
    markSeen,
    toggleDone,
    reset,
  };
}
