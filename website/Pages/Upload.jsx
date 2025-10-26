import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    topics: "",
    pages: "",
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
      
      // Upload PDF file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      setUploadProgress({ file: false, preview: true });
      
      // Upload preview image if provided
      let preview_image_url = null;
      if (previewImage) {
        const result = await base44.integrations.Core.UploadFile({ file: previewImage });
        preview_image_url = result.file_url;
      }
      
      setUploadProgress({ file: false, preview: false });
      
      // Create worksheet record
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
        navigate(createPageUrl("Home"));
      }, 2000);
    },
    onError: (error) => {
      setError(error.message || "Failed to upload worksheet");
      setUploadProgress({ file: false, preview: false });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a PDF file to upload");
      return;
    }
    
    const worksheetData = {
      ...formData,
      topics: formData.topics ? formData.topics.split(',').map(t => t.trim()) : [],
      pages: formData.pages ? parseInt(formData.pages) : undefined,
    };
    
    uploadWorksheetMutation.mutate(worksheetData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload New Worksheet</h1>
        <p className="text-gray-600">Add a new math worksheet to your collection</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Worksheet uploaded successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Upload the worksheet PDF and an optional preview image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">Worksheet PDF *</Label>
                <div className="mt-2">
                  <label 
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadProgress.file ? (
                        <>
                          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-2" />
                          <p className="text-sm text-gray-500">Uploading PDF...</p>
                        </>
                      ) : file ? (
                        <>
                          <FileText className="w-10 h-10 text-orange-500 mb-2" />
                          <p className="text-sm text-gray-700 font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload PDF</p>
                        </>
                      )}
                    </div>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="preview">Preview Image (Optional)</Label>
                <div className="mt-2">
                  <label 
                    htmlFor="preview"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadProgress.preview ? (
                        <>
                          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
                          <p className="text-sm text-gray-500">Uploading image...</p>
                        </>
                      ) : previewImage ? (
                        <>
                          <ImageIcon className="w-10 h-10 text-blue-500 mb-2" />
                          <p className="text-sm text-gray-700 font-medium">{previewImage.name}</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload image</p>
                        </>
                      )}
                    </div>
                    <input
                      id="preview"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setPreviewImage(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., SAT Math Practice - Algebra"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe what this worksheet covers..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAT Math">SAT Math</SelectItem>
                      <SelectItem value="Algebra">Algebra</SelectItem>
                      <SelectItem value="Geometry">Geometry</SelectItem>
                      <SelectItem value="Calculus">Calculus</SelectItem>
                      <SelectItem value="Statistics">Statistics</SelectItem>
                      <SelectItem value="Trigonometry">Trigonometry</SelectItem>
                      <SelectItem value="Pre-Algebra">Pre-Algebra</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="topics">Topics (Optional)</Label>
                <Input
                  id="topics"
                  value={formData.topics}
                  onChange={(e) => handleChange('topics', e.target.value)}
                  placeholder="e.g., quadratic equations, factoring, word problems (comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple topics with commas</p>
              </div>

              <div>
                <Label htmlFor="pages">Number of Pages (Optional)</Label>
                <Input
                  id="pages"
                  type="number"
                  min="1"
                  value={formData.pages}
                  onChange={(e) => handleChange('pages', e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Home"))}
              disabled={uploadWorksheetMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={uploadWorksheetMutation.isPending}
            >
              {uploadWorksheetMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Worksheet
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}