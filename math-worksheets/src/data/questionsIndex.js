import unitsIndex from './questions/index.json';

export function getUnits() {
  return unitsIndex;
}

export function getUnitBySlug(unitSlug) {
  return unitsIndex.find((unit) => unit.unitSlug === unitSlug) ?? null;
}

export function getTopicMeta(unitSlug, topicSlug) {
  const unit = getUnitBySlug(unitSlug);
  if (!unit) return null;
  return unit.topics.find((topic) => topic.topicSlug === topicSlug) ?? null;
}

export function searchTopics(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];
  for (const unit of unitsIndex) {
    for (const topic of unit.topics) {
      if (
        topic.topicTitle.toLowerCase().includes(q) ||
        unit.unitTitle.toLowerCase().includes(q)
      ) {
        results.push({ unit, topic });
      }
    }
  }
  return results;
}
