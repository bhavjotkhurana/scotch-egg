import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import Seo from '@/components/Seo.jsx';

const categoryOptions = [
  'SAT Math',
  'Algebra',
  'Geometry',
  'Calculus',
  'Statistics',
  'Trigonometry',
  'Pre-Algebra',
  'Other',
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function UploadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],
    difficulty: '',
    topics: '',
    pages: '',
  });
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ file: false, preview: false });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadWorksheetMutation = useMutation({
    mutationFn: async (data) => {
      setError(null);
      setUploadProgress({ file: true, preview: false });

      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      setUploadProgress({ file: false, preview: true });

      let preview_image_url = null;
      if (previewImage) {
        const result = await base44.integrations.Core.UploadFile({ file: previewImage });
        preview_image_url = result.file_url;
      }

      setUploadProgress({ file: false, preview: false });

      return base44.entities.Worksheet.create({
        ...data,
        file_url,
        preview_image_url,
        download_count: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worksheets'] });
      setSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('Home'));
      }, 2000);
    },
    onError: (err) => {
      setError(err.message || 'Failed to upload worksheet');
      setUploadProgress({ file: false, preview: false });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!file) {
      setError('Please select a PDF file to upload');
      return;
    }

    if (!formData.categories.length) {
      setError('Please select at least one category');
      return;
    }

    const { categories, topics, pages, ...rest } = formData;
    const worksheetData = {
      ...rest,
      categories,
      topics: topics ? topics.split(',').map((topic) => topic.trim()) : [],
      pages: pages ? parseInt(pages, 10) : undefined,
    };

    uploadWorksheetMutation.mutate(worksheetData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleCategory = (category) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(category);
      const categories = isSelected
        ? prev.categories.filter((item) => item !== category)
        : [...prev.categories, category];

      return { ...prev, categories };
    });
    setError(null);
  };

  return (
    <>
      <Seo
        title="Upload a Math Worksheet"
        description="Share a new Scotch Egg worksheet by uploading your PDF, preview image, and lesson details so students everywhere can download it for free."
        keywords={['upload worksheet', 'share math worksheet', 'SAT worksheet submission']}
        structuredData={({ canonicalUrl }) => ({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Upload Math Worksheet',
          url: canonicalUrl,
          description:
            'Form that allows contributors to upload original math worksheets including files, preview images, and key lesson metadata for students.',
        })}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Worksheet</h1>
        <p className="text-gray-600">Add a new math worksheet to your collection</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check className="h-4 w-4 text-green-600" />
          <span>Worksheet uploaded successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Files</h2>
            <p className="text-sm text-gray-500">Upload the worksheet PDF and an optional preview image</p>
          </header>
          <div className="space-y-6 px-6 py-5">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Worksheet PDF *
              </label>
              <div className="mt-2">
                <label
                  htmlFor="file"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-brand-primary"
                >
                  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                    {uploadProgress.file ? (
                      <>
                        <Loader2 className="mb-2 h-10 w-10 animate-spin text-brand-primary" />
                        <p className="text-sm text-gray-500">Uploading PDF...</p>
                      </>
                    ) : file ? (
                      <>
                        <FileText className="mb-2 h-10 w-10 text-brand-primary" />
                        <p className="text-sm font-medium text-gray-700">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload PDF</p>
                      </>
                    )}
                  </div>
                  <input
                    id="file"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="preview" className="block text-sm font-medium text-gray-700">
                Preview Image (Optional)
              </label>
              <div className="mt-2">
                <label
                  htmlFor="preview"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-brand-primary"
                >
                  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                    {uploadProgress.preview ? (
                      <>
                        <Loader2 className="mb-2 h-10 w-10 animate-spin text-brand-primary" />
                        <p className="text-sm text-gray-500">Uploading image...</p>
                      </>
                    ) : previewImage ? (
                      <>
                        <ImageIcon className="mb-2 h-10 w-10 text-brand-primary" />
                        <p className="text-sm font-medium text-gray-700">{previewImage.name}</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </>
                    )}
                  </div>
                  <input
                    id="preview"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setPreviewImage(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            <p className="text-sm text-gray-500">Tell learners what this worksheet covers</p>
          </header>

          <div className="grid gap-5 px-6 py-5">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                placeholder="Enter a descriptive title"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                placeholder="Summarize what students will practice or learn"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">Categories *</span>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => {
                    const selected = formData.categories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        aria-pressed={selected}
                        className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                          selected
                            ? 'bg-brand-primary text-white border-brand-primary-dark shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
                {formData.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category) => (
                      <span
                        key={`selected-${category}`}
                        className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-semibold text-brand-primary-dark"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
                  Difficulty *
                </label>
                <select
                  id="difficulty"
                  required
                  value={formData.difficulty}
                  onChange={(event) => handleChange('difficulty', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                >
                  <option value="">Select difficulty</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="topics" className="text-sm font-medium text-gray-700">
                Topics (comma separated)
              </label>
              <input
                id="topics"
                type="text"
                value={formData.topics}
                onChange={(event) => handleChange('topics', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                placeholder="Quadratics, factoring, polynomials"
              />
              {formData.topics && (
                <div className="flex flex-wrap gap-2">
                  {formData.topics
                    .split(',')
                    .map((topic) => topic.trim())
                    .filter(Boolean)
                    .map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-semibold text-brand-primary-dark"
                      >
                        {topic}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:max-w-xs">
              <label htmlFor="pages" className="text-sm font-medium text-gray-700">
                Number of pages
              </label>
              <input
                id="pages"
                type="number"
                min={1}
                value={formData.pages}
                onChange={(event) => handleChange('pages', event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                placeholder="Optional"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploadWorksheetMutation.isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploadWorksheetMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Publish Worksheet'
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
