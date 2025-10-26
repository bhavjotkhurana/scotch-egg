import { motion } from 'framer-motion';
import { FileText, Download, BookOpen } from 'lucide-react';
import classNames from 'classnames';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700 border-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Advanced: 'bg-red-100 text-red-700 border-red-200',
};

const categoryColors = {
  'SAT Math': 'bg-purple-100 text-purple-700',
  Algebra: 'bg-blue-100 text-blue-700',
  Geometry: 'bg-pink-100 text-pink-700',
  Calculus: 'bg-indigo-100 text-indigo-700',
  Statistics: 'bg-cyan-100 text-cyan-700',
  Trigonometry: 'bg-orange-100 text-orange-700',
  'Pre-Algebra': 'bg-emerald-100 text-emerald-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function WorksheetCard({ worksheet, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-orange-300 hover:shadow-xl">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-50 to-blue-50">
          {worksheet.preview_image_url ? (
            <img
              src={worksheet.preview_image_url}
              alt={worksheet.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileText className="h-20 w-20 text-orange-300" />
            </div>
          )}

          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-sm">
            <Download className="h-3 w-3 text-gray-600" />
            <span>{worksheet.download_count || 0}</span>
          </div>
        </div>

        <div className="flex-1 p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span
              className={classNames(
                'rounded-full px-3 py-1 text-xs font-semibold',
                categoryColors[worksheet.category] ?? 'bg-gray-100 text-gray-700',
              )}
            >
              {worksheet.category}
            </span>
            <span
              className={classNames(
                'rounded-full border px-3 py-1 text-xs font-semibold',
                difficultyColors[worksheet.difficulty] ?? 'border-gray-200 text-gray-600',
              )}
            >
              {worksheet.difficulty}
            </span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900">{worksheet.title}</h3>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{worksheet.description}</p>

          {worksheet.topics && worksheet.topics.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {worksheet.topics.slice(0, 3).map((topic, index) => (
                <span key={`${worksheet.id}-topic-${index}`} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  {topic}
                </span>
              ))}
              {worksheet.topics.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">+{worksheet.topics.length - 3} more</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{worksheet.pages || '—'} pages</span>
          </div>
          <span className="font-medium text-orange-600">View Details →</span>
        </div>
      </div>
    </motion.div>
  );
}
