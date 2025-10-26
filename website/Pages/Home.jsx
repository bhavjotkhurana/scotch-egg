import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import WorksheetCard from "../components/worksheets/WorksheetCard";
import WorksheetDetailsDialog from "../components/worksheets/WorksheetDetailsDialog";

export default function HomePage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedWorksheet, setSelectedWorksheet] = useState(null);

  const { data: worksheets, isLoading } = useQuery({
    queryKey: ['worksheets'],
    queryFn: () => base44.entities.Worksheet.list("-created_date"),
    initialData: [],
  });

  const filteredWorksheets = worksheets.filter(worksheet => {
    const categoryMatch = categoryFilter === "all" || worksheet.category === categoryFilter;
    const difficultyMatch = difficultyFilter === "all" || worksheet.difficulty === difficultyFilter;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 to-orange-800/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">100% Free • Pay What You Want</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Master Math, One Worksheet at a Time
          </h1>
          
          <p className="text-xl sm:text-2xl text-orange-100 max-w-3xl mx-auto mb-8">
            High-quality practice worksheets for SAT prep and beyond. Download for free, contribute what you can.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">{worksheets.length}</div>
              <div className="text-orange-100">Worksheets</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <div className="text-2xl font-bold">
                {worksheets.reduce((sum, w) => sum + (w.download_count || 0), 0)}
              </div>
              <div className="text-orange-100">Downloads</div>
            </div>
          </div>
        </div>
      </section>

      {/* Worksheets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse Worksheets</h2>
            
            <div className="flex flex-wrap gap-3">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="all" onValueChange={setCategoryFilter}>
            <TabsList className="w-full sm:w-auto flex-wrap h-auto bg-white border border-gray-200">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="SAT Math">SAT Math</TabsTrigger>
              <TabsTrigger value="Algebra">Algebra</TabsTrigger>
              <TabsTrigger value="Geometry">Geometry</TabsTrigger>
              <TabsTrigger value="Calculus">Calculus</TabsTrigger>
              <TabsTrigger value="Statistics">Statistics</TabsTrigger>
              <TabsTrigger value="Trigonometry">Trigonometry</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Worksheets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWorksheets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No worksheets found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorksheets.map((worksheet) => (
              <WorksheetCard
                key={worksheet.id}
                worksheet={worksheet}
                onClick={() => setSelectedWorksheet(worksheet)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Worksheet Details Dialog */}
      <WorksheetDetailsDialog
        worksheet={selectedWorksheet}
        onClose={() => setSelectedWorksheet(null)}
      />
    </div>
  );
}