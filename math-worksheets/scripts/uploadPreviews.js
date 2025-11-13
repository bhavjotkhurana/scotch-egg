#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

loadEnv({ path: path.resolve(__dirname, '../.env.admin') });

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_BUCKET = 'worksheet-files',
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Ensure .env.admin exists with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const previewDir = path.join(repoRoot, 'preview-images');
const indexPath = path.join(repoRoot, 'common-things', 'unit-topic-index.json');

async function loadWorksheetIndex() {
  const content = await fs.readFile(indexPath, 'utf-8');
  const data = JSON.parse(content);
  const titleMap = new Map();
  for (const unit of data) {
    const unitMatch = unit.unitDirectory.match(/Unit_(\d+)/);
    if (!unitMatch) continue;
    const unitNumber = Number(unitMatch[1]);
    for (const topic of unit.topics) {
      const topicMatch = topic.file.match(/Topic_(\d+)/);
      if (!topicMatch) continue;
      const topicNumber = Number(topicMatch[1]);
      const fullTitle = `${unit.unitTitle} – ${topic.title}`;
      titleMap.set(`${unitNumber}-${topicNumber}`, fullTitle);
    }
  }
  return titleMap;
}

async function fetchWorksheetRecords() {
  const { data, error } = await supabase.from('worksheets').select('*');
  if (error) throw new Error(`Failed to fetch worksheets: ${error.message}`);
  const map = new Map();
  for (const record of data ?? []) {
    map.set(record.title, record);
  }
  return map;
}

async function uploadPreviewImage(localPath) {
  const fileBuffer = await fs.readFile(localPath);
  const objectName = `previews/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(objectName, fileBuffer, {
      contentType: 'image/png',
      upsert: false,
    });
  if (error) throw new Error(`Upload failed for ${localPath}: ${error.message}`);
  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(objectName);
  return data.publicUrl;
}

async function main() {
  const titleLookup = await loadWorksheetIndex();
  const worksheetLookup = await fetchWorksheetRecords();

  const files = await fs.readdir(previewDir);
  const pngs = files.filter((file) => /^U\d+T\d+\.png$/i.test(file)).sort();
  if (pngs.length === 0) {
    console.log('No preview images found in preview-images/.');
    return;
  }

  for (const file of pngs) {
    const [, unitNum, topicNum] = file.match(/^U(\d+)T(\d+)\.png$/i) ?? [];
    const key = `${unitNum}-${topicNum}`;
    const title = titleLookup.get(key);
    if (!title) {
      console.warn(`Skipping ${file}: no matching worksheet title.`);
      continue;
    }

    const worksheet = worksheetLookup.get(title);
    if (!worksheet) {
      console.warn(`Skipping ${file}: worksheet titled "${title}" not found in Supabase.`);
      continue;
    }

    const localPath = path.join(previewDir, file);
    console.log(`Uploading preview for ${title} (${file})…`);
    try {
      const publicUrl = await uploadPreviewImage(localPath);
      const { error } = await supabase
        .from('worksheets')
        .update({ preview_image_url: publicUrl })
        .eq('id', worksheet.id);
      if (error) throw new Error(`Update failed: ${error.message}`);
      console.log(`  ✓ Updated worksheet ${worksheet.id}`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
