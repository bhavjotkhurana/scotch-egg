import { useQuery } from '@tanstack/react-query';

// Lazily-imported per-unit question JSON, one Vite chunk per unit so a visitor
// browsing Unit 3 never downloads Unit 6's questions.
const unitLoaders = import.meta.glob('./questions/unit-*.json');

export async function loadUnit(unitSlug) {
  const loader = unitLoaders[`./questions/${unitSlug}.json`];
  if (!loader) throw new Error(`Unknown unit: ${unitSlug}`);
  const mod = await loader();
  return mod.default;
}

export function findTopic(unitData, topicSlug) {
  return unitData?.find((topic) => topic.topicSlug === topicSlug) ?? null;
}

export function useUnitData(unitSlug) {
  return useQuery({
    queryKey: ['unit', unitSlug],
    queryFn: () => loadUnit(unitSlug),
    enabled: !!unitSlug,
    staleTime: Infinity,
  });
}
