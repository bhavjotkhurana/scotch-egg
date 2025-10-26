import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Heart, ExternalLink, Calendar, BookOpen, Tag } from "lucide-react";
import { format } from "date-fns";

const difficultyColors = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

export default function WorksheetDetailsDialog({ worksheet, onClose }) {
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const queryClient = useQueryClient();

  const downloadMutation = useMutation({
    mutationFn: async (id) => {
      await base44.entities.Worksheet.update(id, {
        download_count: (worksheet.download_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worksheets'] });
    },
  });

  const handleDownload = () => {
    if (!worksheet) return;
    
    // Increment download count
    downloadMutation.mutate(worksheet.id);
    
    // Open file in new tab
    window.open(worksheet.file_url, '_blank');
    
    // Show donation prompt
    setShowDonation(true);
  };

  const handleDirectDownload = () => {
    if (!worksheet) return;
    
    // Increment download count
    downloadMutation.mutate(worksheet.id);
    
    // Create a temporary link and click it to download
    const link = document.createElement('a');
    link.href = worksheet.file_url;
    link.download = `${worksheet.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show donation prompt
    setShowDonation(true);
  };

  if (!worksheet) return null;

  return (
    <Dialog open={!!worksheet} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{worksheet.title}</DialogTitle>
          <DialogDescription className="text-base">{worksheet.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview Image */}
          {worksheet.preview_image_url && (
            <div className="rounded-lg overflow-hidden border-2 border-gray-200">
              <img 
                src={worksheet.preview_image_url} 
                alt={worksheet.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{worksheet.category}</div>
              <div className="text-xs text-gray-600 mt-1">Category</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{worksheet.difficulty}</div>
              <div className="text-xs text-gray-600 mt-1">Difficulty</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{worksheet.pages || "—"}</div>
              <div className="text-xs text-gray-600 mt-1">Pages</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{worksheet.download_count || 0}</div>
              <div className="text-xs text-gray-600 mt-1">Downloads</div>
            </div>
          </div>

          {/* Topics */}
          {worksheet.topics && worksheet.topics.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Topics Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {worksheet.topics.map((topic, idx) => (
                  <Badge key={idx} variant="outline" className="bg-gray-50">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created {format(new Date(worksheet.created_date), "MMMM d, yyyy")}</span>
          </div>

          <Separator />

          {/* Download Section */}
          {!showDonation ? (
            <div className="space-y-3">
              <Button 
                onClick={handleDownload}
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Worksheet (Free)
              </Button>
              
              <Button 
                onClick={handleDirectDownload}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Download Directly
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg border-2 border-orange-200">
              <div className="text-center">
                <Heart className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Love this worksheet?</h3>
                <p className="text-gray-600 mb-4">
                  Your support helps create more free resources for students everywhere
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="donation">Optional Contribution</Label>
                <div className="flex gap-2">
                  <Input
                    id="donation"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="text-lg"
                  />
                  <span className="flex items-center text-gray-500 font-medium">USD</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDonationAmount("5")}
                    className="flex-1"
                  >
                    $5
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDonationAmount("10")}
                    className="flex-1"
                  >
                    $10
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDonationAmount("20")}
                    className="flex-1"
                  >
                    $20
                  </Button>
                </div>

                <p className="text-sm text-center text-gray-600 mt-4">
                  Payment integration coming soon! For now, enjoy your free download 🎉
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700 mb-1">100% Free to Use</p>
            <p>All worksheets are free to download and use for personal and educational purposes</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}