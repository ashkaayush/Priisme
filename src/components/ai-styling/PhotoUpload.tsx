import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  onPhotoSelect: (base64: string) => void;
  isAnalyzing?: boolean;
}

export function PhotoUpload({ onPhotoSelect, isAnalyzing }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onPhotoSelect(base64);
    };
    reader.readAsDataURL(file);
  }, [onPhotoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="photo-upload"
      />

      {preview ? (
        <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {!isAnalyzing && (
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-ai" />
              <p className="text-sm font-medium">Analyzing your photo...</p>
              <p className="text-xs text-muted-foreground">This may take a few seconds</p>
            </div>
          )}
        </div>
      ) : (
        <label
          htmlFor="photo-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center aspect-[3/4] max-w-md mx-auto rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-ai bg-ai/5"
              : "border-border hover:border-ai/50 hover:bg-secondary/50"
          )}
        >
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-ai/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-ai" />
            </div>
            <div>
              <p className="font-medium mb-1">Upload your photo</p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Camera className="w-4 h-4" />
              <span>For best results, use a clear front-facing photo</span>
            </div>
          </div>
        </label>
      )}
    </div>
  );
}
