import { delay } from '@/utils';

const STORAGE_KEY = 'math-worksheets-data';

const defaultWorksheets = [
  {
    id: 'worksheet-1',
    title: 'SAT Math Practice – Algebra Essentials',
    description:
      'Brush up on linear equations, inequalities, and systems of equations with this targeted SAT practice set.',
    category: 'SAT Math',
    difficulty: 'Intermediate',
    file_url:
      'https://files.publicreadingroom.com/math-worksheets/sample-sat-algebra.pdf',
    preview_image_url:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    download_count: 42,
    topics: ['Linear Equations', 'Systems', 'Inequalities'],
    pages: 6,
    created_date: '2024-02-10T09:00:00.000Z',
  },
  {
    id: 'worksheet-2',
    title: 'Geometry Fundamentals – Angles and Triangles',
    description:
      'A printable pack that covers complementary angles, triangle sums, and classifying triangles.',
    category: 'Geometry',
    difficulty: 'Beginner',
    file_url:
      'https://files.publicreadingroom.com/math-worksheets/sample-geometry.pdf',
    preview_image_url:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    download_count: 18,
    topics: ['Angle Relationships', 'Triangles'],
    pages: 4,
    created_date: '2024-03-04T12:00:00.000Z',
  },
  {
    id: 'worksheet-3',
    title: 'Advanced Calculus – Derivatives Drill',
    description:
      'Challenge yourself with derivative problems involving product, quotient, and chain rules.',
    category: 'Calculus',
    difficulty: 'Advanced',
    file_url:
      'https://files.publicreadingroom.com/math-worksheets/sample-calculus.pdf',
    preview_image_url:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80',
    download_count: 7,
    topics: ['Derivative Rules', 'Chain Rule'],
    pages: 5,
    created_date: '2024-01-28T15:00:00.000Z',
  },
];

const getInitialData = () => {
  if (typeof window === 'undefined') {
    return defaultWorksheets;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        worksheets: defaultWorksheets,
      }),
    );
    return defaultWorksheets;
  }

  try {
    const parsed = JSON.parse(stored);
    return parsed.worksheets ?? defaultWorksheets;
  } catch (err) {
    console.warn('Failed to parse stored worksheets, resetting.', err);
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultWorksheets;
  }
};

let worksheetCache = getInitialData();

const persist = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      worksheets: worksheetCache,
    }),
  );
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const upsertWorksheet = (worksheet) => {
  const existingIdx = worksheetCache.findIndex((item) => item.id === worksheet.id);
  if (existingIdx >= 0) {
    worksheetCache[existingIdx] = worksheet;
  } else {
    worksheetCache.push(worksheet);
  }
  persist();
  return worksheet;
};

const listWorksheets = async (sortField = '-created_date') => {
  await delay(400);
  const [direction, field] = sortField.startsWith('-')
    ? ['desc', sortField.slice(1)]
    : ['asc', sortField];

  const sorted = [...worksheetCache].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === bValue) return 0;

    if (aValue > bValue) {
      return direction === 'desc' ? -1 : 1;
    }
    return direction === 'desc' ? 1 : -1;
  });
  return sorted;
};

const createWorksheet = async (data) => {
  await delay(400);
  const now = new Date().toISOString();
  const worksheet = {
    id: `worksheet-${Date.now()}`,
    created_date: now,
    download_count: 0,
    ...data,
  };
  upsertWorksheet(worksheet);
  return worksheet;
};

const updateWorksheet = async (id, updates) => {
  await delay(200);
  const existing = worksheetCache.find((item) => item.id === id);
  if (!existing) {
    throw new Error('Worksheet not found');
  }
  const updated = { ...existing, ...updates };
  upsertWorksheet(updated);
  return updated;
};

const uploadFile = async ({ file }) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const file_url = await readFileAsDataUrl(file);
  await delay(300);
  return { file_url };
};

export const base44 = {
  auth: {
    me: async () => {
      await delay(200);
      return {
        id: 'demo-admin',
        name: 'Demo Admin',
        role: 'admin',
      };
    },
  },
  entities: {
    Worksheet: {
      list: listWorksheets,
      create: createWorksheet,
      update: updateWorksheet,
    },
  },
  integrations: {
    Core: {
      UploadFile: uploadFile,
    },
  },
};
