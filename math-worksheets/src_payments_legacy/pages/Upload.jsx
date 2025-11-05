import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';

const categories = [
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
    category: '',
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

    const worksheetData = {
      ...formData,
      topics: formData.topics ? formData.topics.split(',').map((topic) => topic.trim()) : [],
      pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
    };

    uploadWorksheetMutation.mutate(worksheetData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
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
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-orange-500"
                >
                  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                    {uploadProgress.file ? (
                      <>
                        <Loader2 className="mb-2 h-10 w-10 animate-spin text-orange-500" />
                        <p className="text-sm text-gray-500">Uploading PDF...</p>
                      </>
                    ) : file ? (
                      <>
                        <FileText className="mb-2 h-10 w-10 text-orange-500" />
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
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-500"
                >
                  <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
                    {uploadProgress.preview ? (
                      <>
                        <Loader2 className="mb-2 h-10 w-10 animate-spin text-blue-500" />
                        <p className="text-sm text-gray-500">Uploading image...</p>
                      </>
                    ) : previewImage ? (
                      <>
                        <ImageIcon className="mb-2 h-10 w-10 text-blue-500" />
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="Summarize what students will practice or learn"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  required
                  value={formData.category}
                  onChange={(event) => handleChange('category', event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
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
                        className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="Optional"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploadWorksheetMutation.isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
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
  );
}
