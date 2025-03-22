
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarAttributes, renderAvatar } from "@/utils/avatarGenerator";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AvatarVisualizerProps {
  attributes: AvatarAttributes;
  onRegenerate?: () => void;
}

const AvatarVisualizer = ({ attributes, onRegenerate }: AvatarVisualizerProps) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (svgRef.current) {
      setIsLoading(true);
      const svgContent = renderAvatar(attributes);
      svgRef.current.innerHTML = svgContent;
      
      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [attributes]);
  
  const handleDownload = () => {
    if (!svgRef.current) return;
    
    try {
      const svgContent = svgRef.current.innerHTML;
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "personality-avatar.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success("Avatar downloaded successfully");
    } catch (error) {
      console.error("Error downloading avatar:", error);
      toast.error("Failed to download avatar");
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in">
      <Card className={`relative overflow-hidden rounded-2xl shadow-xl w-full max-w-xs aspect-square ${isLoading ? 'animate-pulse' : ''}`}>
        <div ref={svgRef} className="w-full h-full"></div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          </div>
        )}
      </Card>
      
      <div className="flex gap-4">
        {onRegenerate && (
          <Button variant="outline" onClick={onRegenerate} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
        )}
        
        <Button onClick={handleDownload} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default AvatarVisualizer;
