// Splits titles like "Unit 3: Ratios, Rates, and Percents" or
// "Topic 4: Successive Percent Changes" into a short label ("Unit 3") and
// the plain name on its own, so UI can display them with different emphasis.
function splitLabeledTitle(title, label) {
  const re = new RegExp(`^${label}\\s+(\\d+):?\\s*(.*)$`);
  const match = title.match(re);
  if (!match) return { number: '', name: title };
  return { number: match[1], name: match[2] };
}

export function splitUnitTitle(unitTitle) {
  return splitLabeledTitle(unitTitle, 'Unit');
}

export function splitTopicTitle(topicTitle) {
  return splitLabeledTitle(topicTitle, 'Topic');
}
