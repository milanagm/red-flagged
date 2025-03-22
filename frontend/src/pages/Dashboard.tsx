
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/FileUploader";
import AvatarVisualizer from "@/components/AvatarVisualizer";
import AnalysisVisualizer from "@/components/AnalysisVisualizer";
import { ChatAnalysis, parseWhatsAppChat, analyzeChatData } from "@/utils/whatsAppParser";
import { AvatarAttributes, generateAvatarAttributes } from "@/utils/avatarGenerator";
import { LogOut, User, BarChart3, HelpCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatContent, setChatContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [avatarAttributes, setAvatarAttributes] = useState<AvatarAttributes | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upload");

  const handleFileLoaded = useCallback((content: string) => {
    setChatContent(content);
    
    // Start analysis
    setIsAnalyzing(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        // Parse the chat content
        const messages = parseWhatsAppChat(content);
        
        if (messages.length === 0) {
          throw new Error("No messages found in the file. Make sure it's a WhatsApp chat export.");
        }
        
        // Analyze the chat data
        const analysisResult = analyzeChatData(messages);
        setAnalysis(analysisResult);
        
        // Generate avatar based on personality traits
        const avatarAttrs = generateAvatarAttributes(analysisResult.personalityTraits);
        setAvatarAttributes(avatarAttrs);
        
        // Switch to the analysis tab
        setActiveTab("analysis");
        
        toast.success("Chat analyzed successfully");
      } catch (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze chat. Please check the file format.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 500);
  }, []);

  const handleRegenerate = useCallback(() => {
    if (!analysis) return;
    
    // Slightly vary the personality traits for a different avatar
    const randomizedTraits = {
      ...analysis.personalityTraits,
      extraversion: Math.max(0, Math.min(1, analysis.personalityTraits.extraversion + (Math.random() * 0.2 - 0.1))),
      agreeableness: Math.max(0, Math.min(1, analysis.personalityTraits.agreeableness + (Math.random() * 0.2 - 0.1))),
      conscientiousness: Math.max(0, Math.min(1, analysis.personalityTraits.conscientiousness + (Math.random() * 0.2 - 0.1))),
      neuroticism: Math.max(0, Math.min(1, analysis.personalityTraits.neuroticism + (Math.random() * 0.2 - 0.1))),
      openness: Math.max(0, Math.min(1, analysis.personalityTraits.openness + (Math.random() * 0.2 - 0.1))),
    };
    
    // Regenerate avatar
    const newAvatarAttrs = generateAvatarAttributes(randomizedTraits);
    setAvatarAttributes(newAvatarAttrs);
    
    toast.success("Generated a new avatar variation");
  }, [analysis]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Update tab when analysis or avatar changes
  useEffect(() => {
    if (analysis && avatarAttributes && activeTab === "upload") {
      setActiveTab("analysis");
    }
  }, [analysis, avatarAttributes, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b backdrop-blur-sm bg-background/70 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">PersonaChat</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">
                {user?.name}
              </span>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <User className="size-4" />
                <span>Upload</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" disabled={!analysis} className="flex items-center gap-2">
                <BarChart3 className="size-4" />
                <span>Analysis</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="upload" className="space-y-8 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Upload your WhatsApp chat</h2>
              <p className="text-lg text-muted-foreground">
                We'll analyze your chat and create a personality-based avatar just for you
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <FileUploader onFileLoaded={handleFileLoaded} isProcessing={isAnalyzing} />
            </div>
            
            <div className="max-w-2xl mx-auto border rounded-lg p-4 bg-amber-50 border-amber-200">
              <div className="flex gap-2">
                <HelpCircle className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium">How to export your WhatsApp chat</h3>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal pl-4">
                    <li>Open the WhatsApp chat you want to analyze</li>
                    <li>Tap the three dots (⋮) in the top right corner</li>
                    <li>Select "More" → "Export chat"</li>
                    <li>Choose "Without media" for best results</li>
                    <li>Save the .txt file and upload it here</li>
                  </ol>
                  <p className="text-xs text-muted-foreground/70">
                    Your chat data is only processed locally in your browser and is not stored on any server.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="animate-fade-in">
            {analysis && avatarAttributes ? (
              <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
                  <div className="flex flex-col items-center space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight text-center">Your Personality Avatar</h2>
                    <p className="text-center text-muted-foreground">
                      Based on your chat personality analysis
                    </p>
                    <AvatarVisualizer 
                      attributes={avatarAttributes} 
                      onRegenerate={handleRegenerate} 
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">Analysis Results</h2>
                    <p className="text-muted-foreground">
                      Here's what we discovered about your chat personality
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">Dominant Trait</p>
                        <p className="text-xl font-semibold mt-1">
                          {analysis.personalityTraits.dominant.charAt(0).toUpperCase() + 
                            analysis.personalityTraits.dominant.slice(1)}
                        </p>
                      </div>
                      
                      <div className="border rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">Messages Analyzed</p>
                        <p className="text-xl font-semibold mt-1">{analysis.messageCount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-12">
                  <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Detailed Chat Analysis</h2>
                  <AnalysisVisualizer analysis={analysis} />
                </div>
                
                <div className="max-w-3xl mx-auto border rounded-lg p-6 bg-blue-50 border-blue-200">
                  <div className="flex gap-3">
                    <AlertCircle className="size-6 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <h3 className="font-medium text-lg">About This Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        This analysis is based on a simplified model of language processing and 
                        personality assessment. It's meant to be fun and insightful but shouldn't be 
                        considered a professional or clinical evaluation of personality.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        The analysis looks for patterns in your messages that might correlate with 
                        certain personality traits from the "Big Five" model: extraversion, agreeableness, 
                        conscientiousness, neuroticism, and openness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium">No analysis available</h2>
                <p className="text-muted-foreground mt-2">
                  Please upload a WhatsApp chat to see the analysis
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => setActiveTab("upload")}
                >
                  Go to Upload
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
