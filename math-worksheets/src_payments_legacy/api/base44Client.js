import { supabase } from '@/lib/supabaseClient';
import { delay } from '@/utils';

const bucketName = import.meta.env.VITE_SUPABASE_BUCKET ?? 'worksheet-files';

const mapWorksheet = (record) => ({
  id: record.id,
  title: record.title,
  description: record.description,
  category: record.category,
  difficulty: record.difficulty,
  file_url: record.file_url,
  preview_image_url: record.preview_image_url,
  download_count: record.download_count ?? 0,
  topics: record.topics ?? [],
  pages: record.pages ?? null,
  created_date: record.created_at,
});

const handleError = (error, fallbackMessage = 'Unexpected error') => {
  if (error) {
    throw new Error(error.message ?? fallbackMessage);
  }
};

const listWorksheets = async () => {
  await delay(200);
  const { data, error } = await supabase
    .from('worksheets')
    .select('*')
    .order('created_at', { ascending: false });

  handleError(error, 'Failed to fetch worksheets');
  return (data ?? []).map(mapWorksheet);
};

const createWorksheet = async (payload) => {
  await delay(200);
  const { data, error } = await supabase
    .from('worksheets')
    .insert([
      {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        difficulty: payload.difficulty,
        file_url: payload.file_url,
        preview_image_url: payload.preview_image_url,
        download_count: payload.download_count ?? 0,
        topics: payload.topics ?? [],
        pages: payload.pages ?? null,
      },
    ])
    .select()
    .single();

  handleError(error, 'Failed to create worksheet');
  return mapWorksheet(data);
};

const updateWorksheet = async (id, updates) => {
  await delay(120);
  const { data, error } = await supabase
    .from('worksheets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  handleError(error, 'Failed to update worksheet');
  return mapWorksheet(data);
};

const uploadFile = async ({ file }) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileExt = file.name.split('.').pop();
  const uniqueId = Math.random().toString(36).slice(2);
  const path = `${Date.now()}-${uniqueId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  handleError(uploadError, 'Failed to upload file');

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(path);

  return { file_url: publicUrl, path };
};

export const base44 = {
  auth: {
    me: async () => null,
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
