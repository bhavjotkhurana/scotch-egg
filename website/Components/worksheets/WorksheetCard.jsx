import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BookOpen } from "lucide-react";

const difficultyColors = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

const categoryColors = {
  "SAT Math": "bg-purple-100 text-purple-700",
  "Algebra": "bg-blue-100 text-blue-700",
  "Geometry": "bg-pink-100 text-pink-700",
  "Calculus": "bg-indigo-100 text-indigo-700",
  "Statistics": "bg-cyan-100 text-cyan-700",
  "Trigonometry": "bg-orange-100 text-orange-700",
  "Pre-Algebra": "bg-emerald-100 text-emerald-700",
  "Other": "bg-gray-100 text-gray-700",
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
      <Card className="h-full overflow-hidden border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300">
        {/* Preview Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden">
          {worksheet.preview_image_url ? (
            <img 
              src={worksheet.preview_image_url} 
              alt={worksheet.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-20 h-20 text-orange-300" />
            </div>
          )}
          
          {/* Download Count Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Download className="w-3 h-3 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{worksheet.download_count || 0}</span>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Category & Difficulty */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={categoryColors[worksheet.category] || "bg-gray-100 text-gray-700"}>
              {worksheet.category}
            </Badge>
            <Badge 
              variant="outline" 
              className={difficultyColors[worksheet.difficulty]}
            >
              {worksheet.difficulty}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {worksheet.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {worksheet.description}
          </p>

          {/* Topics */}
          {worksheet.topics && worksheet.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {worksheet.topics.slice(0, 3).map((topic, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {topic}
                </span>
              ))}
              {worksheet.topics.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{worksheet.topics.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{worksheet.pages || "—"} pages</span>
          </div>
          <span className="text-orange-600 font-medium hover:underline">
            View Details →
          </span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}