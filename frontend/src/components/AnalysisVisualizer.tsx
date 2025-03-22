
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChatAnalysis } from "@/utils/whatsAppParser";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AnalysisVisualizerProps {
  analysis: ChatAnalysis;
}

const COLORS = ["#60a5fa", "#4ade80", "#f97316", "#8b5cf6", "#ec4899"];

const formatTraitName = (trait: string) => {
  return trait.charAt(0).toUpperCase() + trait.slice(1);
};

const AnalysisVisualizer = ({ analysis }: AnalysisVisualizerProps) => {
  // Prepare data for Pie Chart (messages by participant)
  const messageData = Object.entries(analysis.messagesByParticipant).map(
    ([name, count], index) => ({
      name,
      value: count,
      color: COLORS[index % COLORS.length]
    })
  );
  
  // Prepare data for personality traits
  const personalityData = Object.entries(analysis.personalityTraits)
    .filter(([key]) => key !== "dominant")
    .map(([trait, value]) => ({
      name: formatTraitName(trait),
      value: Math.round(value * 100),
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));
  
  // Prepare data for top words
  const topWordsData = analysis.topWords.slice(0, 5).map((item, index) => ({
    name: item.word,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Overview Card */}
      <Card className="col-span-full lg:col-span-2 shadow-md hover:shadow-lg transition-shadow animate-fade-in animate-delay-100">
        <CardHeader>
          <CardTitle>Chat Overview</CardTitle>
          <CardDescription>Summary of your WhatsApp chat</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Participants
            </span>
            <span className="text-2xl font-bold">{analysis.participantCount}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Messages
            </span>
            <span className="text-2xl font-bold">{analysis.messageCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Words
            </span>
            <span className="text-2xl font-bold">{analysis.wordCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Media Shared
            </span>
            <span className="text-2xl font-bold">{analysis.mediaCount.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Avg. Message Length
            </span>
            <span className="text-2xl font-bold">{analysis.averageMessageLength.toFixed(1)} words</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Sentiment
            </span>
            <span className="text-2xl font-bold">
              {analysis.sentimentScore > 0.2 
                ? "Positive 😊" 
                : analysis.sentimentScore < -0.2 
                ? "Negative 😔" 
                : "Neutral 😐"}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Personality Traits Card */}
      <Card className="col-span-full lg:col-span-1 shadow-md hover:shadow-lg transition-shadow animate-fade-in animate-delay-200">
        <CardHeader>
          <CardTitle>Personality Profile</CardTitle>
          <CardDescription>Based on message analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 bg-secondary/30">
            <p className="font-medium text-center mb-2">Dominant Trait</p>
            <p className="text-2xl font-bold text-center text-primary">
              {formatTraitName(analysis.personalityTraits.dominant)}
            </p>
          </div>
          
          <div className="space-y-4">
            {personalityData.map((trait) => (
              <div key={trait.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{trait.name}</span>
                  <span className="font-medium">{trait.value}%</span>
                </div>
                <Progress value={trait.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Message Distribution Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow animate-fade-in animate-delay-300">
        <CardHeader>
          <CardTitle>Message Distribution</CardTitle>
          <CardDescription>Who talks the most</CardDescription>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={messageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {messageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Top Words Card */}
      <Card className="shadow-md hover:shadow-lg transition-shadow animate-fade-in animate-delay-400">
        <CardHeader>
          <CardTitle>Most Used Words</CardTitle>
          <CardDescription>Frequently used terms</CardDescription>
        </CardHeader>
        <CardContent className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topWordsData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {topWordsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Personality Insights Card */}
      <Card className="col-span-full shadow-md hover:shadow-lg transition-shadow animate-fade-in animate-delay-500">
        <CardHeader>
          <CardTitle>Personality Insights</CardTitle>
          <CardDescription>Based on your dominant trait</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.personalityTraits.dominant === "extraversion" && (
              <p className="text-muted-foreground">
                You appear to be <span className="text-foreground font-medium">outgoing and energetic</span>. 
                Your messages suggest that you enjoy social interactions and express yourself with enthusiasm. 
                You likely bring positive energy to conversations and aren't afraid to take the lead.
              </p>
            )}
            
            {analysis.personalityTraits.dominant === "agreeableness" && (
              <p className="text-muted-foreground">
                You come across as <span className="text-foreground font-medium">friendly and cooperative</span>. 
                Your communication style shows compassion and a tendency to maintain harmony. 
                You're likely to be considerate of others' feelings and avoid confrontation when possible.
              </p>
            )}
            
            {analysis.personalityTraits.dominant === "conscientiousness" && (
              <p className="text-muted-foreground">
                You demonstrate being <span className="text-foreground font-medium">organized and efficient</span>. 
                Your messages reflect attention to detail and a methodical approach to communication. 
                You likely value structure and prefer clear, direct exchanges of information.
              </p>
            )}
            
            {analysis.personalityTraits.dominant === "neuroticism" && (
              <p className="text-muted-foreground">
                Your messages suggest you may be <span className="text-foreground font-medium">emotionally responsive</span>. 
                You appear to experience and express a range of emotions in your communications. 
                You might be more sensitive to subtle changes in conversations and group dynamics.
              </p>
            )}
            
            {analysis.personalityTraits.dominant === "openness" && (
              <p className="text-muted-foreground">
                You come across as <span className="text-foreground font-medium">curious and imaginative</span>. 
                Your communication style reflects creativity and interest in new ideas. 
                You likely enjoy intellectual discussions and exploring different perspectives.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisVisualizer;
