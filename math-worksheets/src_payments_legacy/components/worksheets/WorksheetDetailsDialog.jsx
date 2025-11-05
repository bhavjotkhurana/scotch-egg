import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Download, Heart, ExternalLink, Calendar, BookOpen, Tag, X } from 'lucide-react';
import { format } from 'date-fns';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
};

export default function WorksheetDetailsDialog({ worksheet, onClose }) {
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const queryClient = useQueryClient();

  const downloadMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.Worksheet.update(id, {
        download_count: (worksheet.download_count || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worksheets'] });
    },
  });

  if (!worksheet) {
    return null;
  }

  const handleDownload = (direct = false) => {
    downloadMutation.mutate(worksheet.id);

    if (direct) {
      const link = document.createElement('a');
      link.href = worksheet.file_url;
      link.download = `${worksheet.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(worksheet.file_url, '_blank', 'noopener,noreferrer');
    }

    setShowDonation(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <header className="space-y-2 pr-10">
          <h2 className="text-2xl font-bold text-gray-900">{worksheet.title}</h2>
          <p className="text-base text-gray-600">{worksheet.description}</p>
        </header>

        <div className="mt-6 space-y-6">
          {worksheet.preview_image_url && (
            <div className="overflow-hidden rounded-lg border-2 border-gray-200">
              <img
                src={worksheet.preview_image_url}
                alt={worksheet.title}
                className="h-64 w-full object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-orange-50 p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{worksheet.category}</div>
              <div className="mt-1 text-xs text-gray-600">Category</div>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{worksheet.difficulty}</div>
              <div className="mt-1 text-xs text-gray-600">Difficulty</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{worksheet.pages || '—'}</div>
              <div className="mt-1 text-xs text-gray-600">Pages</div>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{worksheet.download_count || 0}</div>
              <div className="mt-1 text-xs text-gray-600">Downloads</div>
            </div>
          </div>

          {worksheet.topics && worksheet.topics.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Tag className="h-4 w-4" />
                Topics Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {worksheet.topics.map((topic, index) => (
                  <span
                    key={`${worksheet.id}-topic-${index}`}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              Created {worksheet.created_date ? format(new Date(worksheet.created_date), 'MMMM d, yyyy') : 'Recently'}
            </span>
          </div>

          <hr className="border-gray-200" />

          {!showDonation ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleDownload(false)}
                className="flex w-full items-center justify-center rounded-lg bg-orange-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-orange-700"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Worksheet (Free)
              </button>

              <button
                type="button"
                onClick={() => handleDownload(true)}
                className="flex w-full items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Download Directly
              </button>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-blue-50 p-6">
              <div className="text-center">
                <Heart className="mx-auto mb-3 h-12 w-12 text-orange-500" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">Love this worksheet?</h3>
                <p className="text-gray-600">
                  Your support helps create more free resources for students everywhere.
                </p>
              </div>

              <label htmlFor="donation" className="text-sm font-medium text-gray-700">
                Optional Contribution
              </label>
              <div className="flex gap-2">
                <input
                  id="donation"
                  type="number"
                  min="0"
                  step="0.01"
                  value={donationAmount}
                  onChange={(event) => setDonationAmount(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  placeholder="Enter amount"
                />
                <span className="flex items-center text-sm font-medium text-gray-500">USD</span>
              </div>

              <div className="flex gap-2">
                {[5, 10, 20].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDonationAmount(String(amount))}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Payment integration coming soon! For now, enjoy your free download 🎉
              </p>
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500">
            <p className="mb-1 font-medium text-gray-700">100% Free to Use</p>
            <p>All worksheets are free to download and use for personal and educational purposes.</p>
          </div>
        </div>

        {worksheet.difficulty && (
          <div
            className={`mt-6 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${difficultyColors[worksheet.difficulty] ?? 'border-gray-200 text-gray-600'}`}
          >
            <BookOpen className="mr-1 h-3 w-3" />
            {worksheet.difficulty} level
          </div>
        )}
      </div>
    </div>
  );
}
