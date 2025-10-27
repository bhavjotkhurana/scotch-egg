#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import minimist from 'minimist';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { lookup as mimeLookup } from 'mime-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.admin');
loadEnv({ path: envPath });

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET = 'worksheet-files',
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Missing Supabase credentials. Ensure .env.admin exists with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
  );
  process.exit(1);
}

const args = minimist(process.argv.slice(2), {
  string: [
    'title',
    'description',
    'category',
    'difficulty',
    'topics',
    'pdf',
    'preview',
  ],
  alias: {
    title: 't',
    description: 'd',
    category: 'c',
    difficulty: 'l',
    topics: 'o',
    pdf: 'f',
    preview: 'p',
    pages: 'n',
  },
});

const requiredFields = ['title', 'description', 'category', 'difficulty', 'pdf'];
const missing = requiredFields.filter((field) => !args[field]);
if (missing.length) {
  console.error(`Missing required options: ${missing.join(', ')}`);
  printUsage();
  process.exit(1);
}

const worksheet = {
  title: args.title,
  description: args.description,
  category: args.category,
  difficulty: args.difficulty,
  topics: args.topics
    ? args.topics.split(',').map((topic) => topic.trim()).filter(Boolean)
    : [],
  pages: args.pages ? Number.parseInt(args.pages, 10) : null,
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function uploadFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const fileBuffer = await fs.readFile(absolutePath);
  const fileExt = path.extname(absolutePath).replace('.', '') || 'bin';
  const contentType =
    mimeLookup(fileExt) || 'application/octet-stream';
  const objectPath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(objectPath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);

  return publicUrl;
}

async function run() {
  console.log('Uploading worksheet assets…');
  const fileUrl = await uploadFile(args.pdf);

  let previewUrl = null;
  if (args.preview) {
    previewUrl = await uploadFile(args.preview);
  }

  console.log('Creating worksheet record…');
  const { data, error } = await supabase
    .from('worksheets')
    .insert([
      {
        ...worksheet,
        file_url: fileUrl,
        preview_image_url: previewUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  console.log(`✅ Worksheet created: ${data.id}`);
}

run()
  .then(() => {
    console.log('Done.');
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

function printUsage() {
  console.log(`
Usage:
  node scripts/uploadWorksheet.js \\
    --title "Algebra Practice" \\
    --description "Focused practice on linear equations" \\
    --category "Algebra" \\
    --difficulty "Intermediate" \\
    --pdf "./files/algebra.pdf" \\
    [--preview "./images/algebra-preview.png"] \\
    [--topics "Linear Equations,Systems"] \\
    [--pages 6]
`);
}
