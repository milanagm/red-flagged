
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileLoaded: (content: string) => void;
  isProcessing?: boolean;
}

const FileUploader = ({ onFileLoaded, isProcessing = false }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReading, setIsReading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file) return;
    
    // Check if file is a text file
    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.error("Please upload a .txt file");
      return;
    }
    
    setSelectedFile(file);
    setIsReading(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (content) {
          onFileLoaded(content);
        } else {
          toast.error("Could not read file content");
        }
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading file");
      } finally {
        setIsReading(false);
      }
    };
    
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      toast.error("Error reading file");
      setIsReading(false);
    };
    
    reader.readAsText(file);
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  return (
    <div 
      className={`file-drop-area ${isDragging ? 'active' : ''} ${selectedFile ? 'border-primary/50 bg-primary/5' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileInputChange}
        accept=".txt"
        className="sr-only"
        disabled={isProcessing || isReading}
      />
      
      {selectedFile ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          
          <div className="text-center">
            <p className="font-medium text-lg">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          
          {isProcessing || isReading ? (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isReading ? "Reading file..." : "Analyzing chat..."}</span>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive/80"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center space-y-1">
            <p className="font-medium text-lg">Upload WhatsApp Chat</p>
            <p className="text-sm text-muted-foreground">
              Drag and drop your WhatsApp chat .txt file here
            </p>
          </div>
          
          <Button onClick={handleButtonClick} className="mt-2">
            Select File
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
