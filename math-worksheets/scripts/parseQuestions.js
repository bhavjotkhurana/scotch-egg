#!/usr/bin/env node
// Parses the repo's LaTeX topic files into the JSON question bank consumed by the app.
// Run manually with `npm run parse`; also runs automatically via the `prebuild` script.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const outDir = path.resolve(__dirname, '..', 'src', 'data', 'questions');
const indexPath = path.join(repoRoot, 'common-things', 'unit-topic-index.json');

const warnings = [];
const exclusionLog = [];

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractDocumentBody(content, label) {
  const beginTag = '\\begin{document}';
  const endTag = '\\end{document}';
  const beginIdx = content.indexOf(beginTag);
  const endIdx = content.lastIndexOf(endTag);
  if (beginIdx === -1 || endIdx === -1 || endIdx <= beginIdx) {
    throw new Error(`${label}: could not find \\begin{document}/\\end{document}`);
  }
  return content.slice(beginIdx + beginTag.length, endIdx);
}

function stripNoise(body) {
  let out = body.replace(/\\ReflectionPage\{[^}]*\}\{[^}]*\}/g, '');
  // Full-line comments only (escaped \% left untouched).
  out = out.replace(/^[ \t]*%.*$/gm, '');
  // Standalone layout macros that carry no content.
  out = out.replace(/^[ \t]*\\(?:newpage|clearpage|noindent|bigskip|medskip|smallskip)\b[ \t]*$/gm, '');
  out = out.replace(/^[ \t]*\\vspace\{[^}]*\}[ \t]*$/gm, '');
  return out;
}

function splitByMarker(content, markerRe) {
  const matches = [...content.matchAll(markerRe)];
  const chunks = [];
  for (let i = 0; i < matches.length; i++) {
    const header = matches[i][1].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    chunks.push({ header, content: content.slice(start, end) });
  }
  return chunks;
}

const SECTION_RE = /\\section\*\{([^}]*)\}/g;
const SUBSECTION_RE = /\\subsection\*\{([^}]*)\}/g;

function splitSections(body) {
  return splitByMarker(body, SECTION_RE);
}

function splitSubsections(content) {
  return splitByMarker(content, SUBSECTION_RE);
}

// Depth-aware \item extraction: some solutions embed a nested itemize/enumerate
// (e.g. a sub-bulleted explanation) inside an outer item's own text. A flat
// \item-boundary regex would miscount those nested bullets as top-level items,
// so this tracks list-nesting depth and only splits on \item tokens at the
// shallowest depth any \item appears at in the given content.
function extractItems(content) {
  const tokenRe = /\\begin\{(?:itemize|enumerate)\}|\\end\{(?:itemize|enumerate)\}|\\item\b/g;
  const positions = [];
  let depth = 0;
  let match;
  while ((match = tokenRe.exec(content)) !== null) {
    const tok = match[0];
    if (tok.startsWith('\\begin')) {
      depth++;
    } else if (tok.startsWith('\\end')) {
      positions.push({ index: match.index, depth, isEnd: true });
      depth--;
    } else {
      positions.push({ index: match.index, depth, isItem: true, itemEnd: match.index + tok.length });
    }
  }

  const itemDepths = positions.filter((p) => p.isItem).map((p) => p.depth);
  if (itemDepths.length === 0) return [];
  const minDepth = Math.min(...itemDepths);
  const topItems = positions.filter((p) => p.isItem && p.depth === minDepth);

  const items = [];
  for (let i = 0; i < topItems.length; i++) {
    const start = topItems[i].itemEnd;
    let end = content.length;
    if (i + 1 < topItems.length) {
      end = topItems[i + 1].index;
    } else {
      const closer = positions.find((p) => p.isEnd && p.index > start && p.depth === minDepth);
      if (closer) end = closer.index;
    }
    const text = content.slice(start, end).trim();
    if (text.length > 0) items.push(text);
  }
  return items;
}

function findEnumerateBlock(content, label) {
  const re = /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g;
  const matches = [...content.matchAll(re)];
  if (matches.length !== 1) {
    throw new Error(`${label}: expected exactly one \\begin{enumerate} block, found ${matches.length}`);
  }
  return matches[0][1];
}

function extractCounterStart(enumerateInner) {
  const m = enumerateInner.match(/\\setcounter\{enumi\}\{(\d+)\}/);
  return m ? parseInt(m[1], 10) : 0;
}

function matchPartLetter(header) {
  const m = header.match(/^Part\s+([A-Z])\b/);
  return m ? m[1] : null;
}

function matchSolutionPartLetter(header) {
  const m = header.match(/^Part\s+([A-Z])\s+Solutions\b/);
  return m ? m[1] : null;
}

const PLACEHOLDER_RE = /\((?:insert|diagram)/i;
function hasPlaceholder(text) {
  return PLACEHOLDER_RE.test(text);
}

// A hand-authored diagram spec: a fenced JSON block that can sit inside a
// part's intro text (shared by every question in that part, e.g. a scatterplot
// or tree diagram used across several sub-questions) or inside a single
// question's own text (a one-off figure specific to that item). Stripped out
// before the surrounding prose is tokenized as rich text.
const DIAGRAM_RE = /\\begin\{diagramdata\}([\s\S]*?)\\end\{diagramdata\}/;
function extractDiagram(text, label) {
  const match = text.match(DIAGRAM_RE);
  if (!match) return { diagram: null, text };
  let diagram;
  try {
    diagram = JSON.parse(match[1].trim());
  } catch (e) {
    throw new Error(`${label}: invalid diagramdata JSON (${e.message})`);
  }
  const remaining = text.slice(0, match.index) + text.slice(match.index + match[0].length);
  return { diagram, text: remaining };
}

function unescapeLatexText(str) {
  return str
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\newline/g, ' ')
    .replace(/\\\\/g, ' ')
    .replace(/\\qquad/g, '  ')
    .replace(/\\quad/g, ' ')
    .replace(/~/g, ' ');
}

// One level of brace nesting allowed (covers e.g. \boxed{\text{cost per day}}).
const BRACE_ARG = '(?:[^{}]|\\{[^{}]*\\})*';

// A fresh RegExp per call: tokenizeRichText recurses (for nested lists), and a
// shared module-level regex's `lastIndex` would get clobbered by the inner
// call while the outer call's `while` loop is still iterating over it.
function makeRichTextRe() {
  return new RegExp(
    [
      '\\\\\\[(?<display>[\\s\\S]*?)\\\\\\]', // \[ ... \]  (display math)
      '\\\\\\((?<inline>[\\s\\S]*?)\\\\\\)', // \( ... \)  (inline math)
      `(?<boxed>\\\\boxed\\{${BRACE_ARG}\\})`, // \boxed{...} used outside math delimiters
      '(?<!\\\\)\\$(?<dollarMath>[^$]*?)(?<!\\\\)\\$', // bare $ ... $ math (rare, but present once in the corpus)
      '\\\\textbf\\{(?<bold1>[^{}]*)\\}',
      '\\\\emph\\{(?<bold2>[^{}]*)\\}',
      '\\\\textit\\{(?<italic>[^{}]*)\\}',
      '\\\\subsection\\*\\{(?<subheading>[^{}]*)\\}', // a sub-heading inside prose (e.g. within Concept Summary)
      '\\\\begin\\{(?<listKind>itemize|enumerate)\\}(?<listInner>[\\s\\S]*?)\\\\end\\{\\k<listKind>\\}', // a nested list inside prose
    ].join('|'),
    'g'
  );
}

function tokenizeRichText(raw, label) {
  const segments = [];
  let currentRuns = [];
  let lastIndex = 0;

  function flushText() {
    if (currentRuns.length > 0) {
      segments.push({ type: 'text', value: currentRuns });
      currentRuns = [];
    }
  }

  function pushProse(str, style) {
    const cleaned = unescapeLatexText(str);
    if (cleaned.length === 0) return;
    if (/\\[a-zA-Z]/.test(cleaned)) {
      warnings.push(`${label}: possible unhandled LaTeX command in text: "${cleaned.slice(0, 60)}"`);
    }
    currentRuns.push({ text: cleaned, bold: !!style?.bold, italic: !!style?.italic });
  }

  const richTextRe = makeRichTextRe();
  let match;
  while ((match = richTextRe.exec(raw)) !== null) {
    const { display, inline, boxed, dollarMath, bold1, bold2, italic, subheading, listKind, listInner } =
      match.groups;
    const full = match[0];
    const gap = raw.slice(lastIndex, match.index);
    if (gap) pushProse(gap);

    if (display !== undefined) {
      flushText();
      segments.push({ type: 'display-math', value: display.trim() });
    } else if (inline !== undefined) {
      flushText();
      segments.push({ type: 'inline-math', value: inline.trim() });
    } else if (boxed !== undefined) {
      flushText();
      segments.push({ type: 'inline-math', value: boxed.trim() });
    } else if (dollarMath !== undefined) {
      flushText();
      segments.push({ type: 'inline-math', value: dollarMath.trim() });
    } else if (bold1 !== undefined) {
      pushProse(bold1, { bold: true });
    } else if (bold2 !== undefined) {
      pushProse(bold2, { bold: true });
    } else if (italic !== undefined) {
      pushProse(italic, { italic: true });
    } else if (subheading !== undefined) {
      flushText();
      segments.push({ type: 'text', value: [{ text: subheading.trim(), bold: true }] });
    } else if (listInner !== undefined) {
      flushText();
      const listItems = extractItems(`\\begin{${listKind}}${listInner}\\end{${listKind}}`);
      segments.push({
        type: 'list',
        ordered: listKind === 'enumerate',
        items: listItems.map((item) => tokenizeRichText(item, `${label} (nested list)`)),
      });
    }
    lastIndex = match.index + full.length;
  }
  const rest = raw.slice(lastIndex);
  if (rest) pushProse(rest);
  flushText();

  return segments;
}

function isMeaningful(segments) {
  return segments.some((seg) => {
    if (seg.type !== 'text') return true;
    return seg.value.some((run) => run.text.trim().length > 0);
  });
}

function splitParagraphs(content) {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function processPracticeAndSolutions(practiceContent, answerKeyContent, label) {
  const qSubs = splitSubsections(practiceContent);
  const sSubs = splitSubsections(answerKeyContent);

  const qLetters = qSubs.map((s) => {
    const l = matchPartLetter(s.header);
    if (!l) throw new Error(`${label}: unrecognized practice subsection header "${s.header}"`);
    return l;
  });
  const sLetters = sSubs.map((s) => {
    const l = matchSolutionPartLetter(s.header);
    if (!l) throw new Error(`${label}: unrecognized solutions subsection header "${s.header}"`);
    return l;
  });

  if (qLetters.length !== sLetters.length || qLetters.some((l, i) => l !== sLetters[i])) {
    throw new Error(
      `${label}: practice parts [${qLetters.join(',')}] do not match solution parts [${sLetters.join(',')}]`
    );
  }

  const parts = [];
  for (let i = 0; i < qSubs.length; i++) {
    const letter = qLetters[i];
    const qSub = qSubs[i];
    const sSub = sSubs[i];
    const partLabel = `${label} Part ${letter}`;

    const qEnumIdx = qSub.content.search(/\\begin\{enumerate\}/);
    const sEnumIdx = sSub.content.search(/\\begin\{enumerate\}/);
    let qPreText = qEnumIdx === -1 ? qSub.content : qSub.content.slice(0, qEnumIdx);
    const sPreText = sEnumIdx === -1 ? sSub.content : sSub.content.slice(0, sEnumIdx);

    const { diagram: partDiagram, text: qPreTextNoDiagram } = extractDiagram(qPreText, `${partLabel} intro`);
    qPreText = qPreTextNoDiagram;

    const qEnumInner = findEnumerateBlock(qSub.content, `${partLabel} questions`);
    const sEnumInner = findEnumerateBlock(sSub.content, `${partLabel} solutions`);

    const qCounterStart = extractCounterStart(qEnumInner);
    const sCounterStart = extractCounterStart(sEnumInner);
    if (qCounterStart !== sCounterStart) {
      throw new Error(
        `${partLabel}: counter mismatch (questions start at ${qCounterStart}, solutions start at ${sCounterStart})`
      );
    }

    const qItems = extractItems(qEnumInner);
    const sItems = extractItems(sEnumInner);
    if (qItems.length !== sItems.length) {
      throw new Error(
        `${partLabel}: item count mismatch (${qItems.length} questions vs ${sItems.length} solutions)`
      );
    }

    if (hasPlaceholder(qPreText) || hasPlaceholder(sPreText)) {
      exclusionLog.push(`${partLabel}: excluded whole part (unresolved graph/diagram placeholder)`);
      continue;
    }

    const questions = [];
    for (let j = 0; j < qItems.length; j++) {
      const number = qCounterStart + j + 1;
      const { diagram: itemDiagram, text: qRaw } = extractDiagram(qItems[j], `${partLabel} Q${number}`);
      const sRaw = sItems[j];
      if (hasPlaceholder(qRaw) || hasPlaceholder(sRaw)) {
        exclusionLog.push(`${partLabel} Item ${number}: excluded (unresolved graph/diagram placeholder)`);
        continue;
      }
      questions.push({
        number,
        ...(itemDiagram ? { diagram: itemDiagram } : {}),
        prompt: tokenizeRichText(qRaw, `${partLabel} Q${number}`),
        solution: tokenizeRichText(sRaw, `${partLabel} Q${number} solution`),
      });
    }

    if (questions.length === 0) continue;

    const partIntroSegments = tokenizeRichText(qPreText, `${partLabel} intro`);
    const partIntro = isMeaningful(partIntroSegments) ? partIntroSegments : null;

    parts.push({
      partLabel: letter,
      partTitle: qSub.header,
      ...(partIntro ? { partIntro } : {}),
      ...(partDiagram ? { partDiagram } : {}),
      questions,
    });
  }

  return parts;
}

function processTopic(unit, topic) {
  const label = `${unit.unitDirectory}/${topic.file}`;
  const filePath = path.join(repoRoot, unit.unitDirectory, topic.file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const body = extractDocumentBody(raw, label);
  const cleaned = stripNoise(body);
  const sections = splitSections(cleaned);

  let hasConceptSummary = false;
  let coreSkillsSection;
  let keyTakeawaysSection;
  let practiceSection;
  let answerKeySection;
  const exampleSections = [];
  // Document-ordered list of "lesson" chunks: the primary Concept Summary section
  // plus any extra top-level sections that don't match a known category (e.g. a
  // file that splits its lesson into named sub-sections like "Compound
  // Inequalities" before Core Skills). Folded together rather than treated as errors.
  const conceptChunks = [];

  for (const sec of sections) {
    if (sec.header.startsWith('Concept Summary')) {
      hasConceptSummary = true;
      conceptChunks.push({ header: null, content: sec.content });
    } else if (sec.header.startsWith('Core Skills')) {
      if (coreSkillsSection) throw new Error(`${label}: multiple Core Skills sections`);
      coreSkillsSection = sec;
    } else if (sec.header.startsWith('Example')) {
      exampleSections.push(sec);
    } else if (sec.header.startsWith('Key Takeaways')) {
      if (keyTakeawaysSection) throw new Error(`${label}: multiple Key Takeaways sections`);
      keyTakeawaysSection = sec;
    } else if (sec.header.startsWith('Practice Questions')) {
      if (practiceSection) throw new Error(`${label}: multiple Practice Questions sections`);
      practiceSection = sec;
    } else if (sec.header.startsWith('Answer Key and Solutions')) {
      if (answerKeySection) throw new Error(`${label}: multiple Answer Key sections`);
      answerKeySection = sec;
    } else if (!keyTakeawaysSection && !practiceSection && !answerKeySection) {
      // Unrecognized header encountered while still in the lesson portion of the
      // file (before Key Takeaways/Practice/Answer Key) — treat as extra lesson
      // content rather than failing, but keep its heading visible.
      conceptChunks.push({ header: sec.header, content: sec.content });
    } else {
      throw new Error(`${label}: unrecognized section header "${sec.header}"`);
    }
  }

  const required = [
    ['Concept Summary', hasConceptSummary],
    ['Key Takeaways', keyTakeawaysSection],
    ['Practice Questions', practiceSection],
  ];
  for (const [name, present] of required) {
    if (!present) throw new Error(`${label}: missing required section "${name}"`);
  }

  const conceptSummary = conceptChunks
    .flatMap((chunk) => {
      const paragraphs = splitParagraphs(chunk.content).map((p) =>
        tokenizeRichText(p, `${label} Concept Summary`)
      );
      if (chunk.header) {
        return [[{ type: 'text', value: [{ text: chunk.header, bold: true }] }], ...paragraphs];
      }
      return paragraphs;
    })
    .filter(isMeaningful);
  const coreSkills = coreSkillsSection
    ? extractItems(coreSkillsSection.content).map((t) => tokenizeRichText(t, `${label} Core Skills`))
    : [];
  const examples = exampleSections.map((sec) => ({
    title: sec.header,
    body: tokenizeRichText(sec.content, `${label} ${sec.header}`),
  }));
  const keyTakeaways = extractItems(keyTakeawaysSection.content).map((t) =>
    tokenizeRichText(t, `${label} Key Takeaways`)
  );
  let practiceParts;
  if (!answerKeySection) {
    exclusionLog.push(`${label}: no Answer Key section found — all practice questions excluded`);
    practiceParts = [];
  } else {
    practiceParts = processPracticeAndSolutions(practiceSection.content, answerKeySection.content, label);
  }

  const unitNumberMatch = unit.unitDirectory.match(/^Unit_(\d+)/);
  if (!unitNumberMatch) throw new Error(`${label}: could not extract unit number from "${unit.unitDirectory}"`);
  const unitSlug = `unit-${unitNumberMatch[1]}`;
  const topicSlug = slugify(topic.title);

  return {
    unitSlug,
    unitDirectory: unit.unitDirectory,
    unitTitle: unit.unitTitle,
    file: topic.file,
    topicSlug,
    topicTitle: topic.title,
    conceptSummary,
    coreSkills,
    examples,
    keyTakeaways,
    practiceParts,
    questionCount: practiceParts.reduce((sum, p) => sum + p.questions.length, 0),
    exampleCount: examples.length,
  };
}

function main() {
  const unitsIndex = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  const unitsOut = [];
  let totalTopics = 0;
  let totalQuestions = 0;

  for (const unit of unitsIndex) {
    const realTopics = unit.topics.filter((t) => t.title !== t.file.replace(/\.tex$/, ''));
    if (realTopics.length === 0) continue;

    const topicRecords = [];
    const seenSlugs = new Set();
    for (const topic of realTopics) {
      const record = processTopic(unit, topic);
      if (seenSlugs.has(record.topicSlug)) {
        throw new Error(`${unit.unitDirectory}/${topic.file}: duplicate topicSlug "${record.topicSlug}"`);
      }
      seenSlugs.add(record.topicSlug);
      topicRecords.push(record);
      totalQuestions += record.questionCount;
      console.log(
        `  ${record.unitSlug}/${record.topicSlug}: ${record.examples.length} examples, ${record.questionCount} questions`
      );
    }
    totalTopics += topicRecords.length;

    const unitNumberMatch = unit.unitDirectory.match(/^Unit_(\d+)/);
    const unitSlug = `unit-${unitNumberMatch[1]}`;
    unitsOut.push({
      unitSlug,
      unitNumber: parseInt(unitNumberMatch[1], 10),
      unitDirectory: unit.unitDirectory,
      unitTitle: unit.unitTitle,
      topics: topicRecords,
    });
  }

  unitsOut.sort((a, b) => a.unitNumber - b.unitNumber);

  fs.mkdirSync(outDir, { recursive: true });

  const indexOut = [];
  for (const unit of unitsOut) {
    const filePath = path.join(outDir, `${unit.unitSlug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(unit.topics, null, 2) + '\n');
    indexOut.push({
      unitSlug: unit.unitSlug,
      unitDirectory: unit.unitDirectory,
      unitTitle: unit.unitTitle,
      topics: unit.topics.map((t) => ({
        topicSlug: t.topicSlug,
        topicTitle: t.topicTitle,
        questionCount: t.questionCount,
        exampleCount: t.exampleCount,
      })),
    });
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(indexOut, null, 2) + '\n');

  console.log('');
  if (exclusionLog.length > 0) {
    console.log(`Excluded ${exclusionLog.length} item(s)/part(s) due to unresolved graph placeholders:`);
    for (const line of exclusionLog) console.log(`  - ${line}`);
    console.log('');
  }
  if (warnings.length > 0) {
    console.log(`${warnings.length} warning(s):`);
    for (const line of warnings) console.log(`  ! ${line}`);
    console.log('');
  }

  console.log(`Wrote ${unitsOut.length} unit files, ${totalTopics} topics, ${totalQuestions} questions.`);
  if (totalQuestions < 900 || totalQuestions > 1100) {
    console.log(`  (sanity check: expected roughly ~970 questions after exclusions — got ${totalQuestions})`);
  }
}

try {
  main();
} catch (err) {
  console.error('\nParse failed:');
  console.error(err.message);
  process.exit(1);
}
