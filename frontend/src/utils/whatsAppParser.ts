
// Types
export interface ChatMessage {
  timestamp: string;
  sender: string;
  content: string;
  type: "text" | "media" | "system";
}

export interface ChatAnalysis {
  participantCount: number;
  participants: string[];
  messageCount: number;
  messagesByParticipant: Record<string, number>;
  wordCount: number;
  averageMessageLength: number;
  mediaCount: number;
  emojis: string[];
  topWords: { word: string; count: number }[];
  topEmojis: { emoji: string; count: number }[];
  sentimentScore: number;
  messageTimeDistribution: Record<string, number>;
  personalityTraits: PersonalityTraits;
}

export interface PersonalityTraits {
  extraversion: number;
  agreeableness: number;
  conscientiousness: number;
  neuroticism: number;
  openness: number;
  dominant: string;
}

// RegEx pattern for WhatsApp messages
// Matches formats like:
// [02/01/23, 10:15:30] John Doe: Hello there!
// 02/01/23, 10:15:30 - John Doe: Hello there!
const messagePattern = /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4},\s\d{1,2}:\d{2}(?::\d{2})?)\]?\s-?\s([^:]+):\s(.+)$/;

// Function to parse WhatsApp chat export
export const parseWhatsAppChat = (text: string): ChatMessage[] => {
  const lines = text.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  let currentMessage: ChatMessage | null = null;

  for (const line of lines) {
    // Try to match a new message
    const match = line.match(messagePattern);
    
    if (match) {
      // If we have a previous message, add it to the array
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      // Create a new message
      const [, timestamp, sender, content] = match;
      
      const type = content.includes("<Media omitted>") ? "media" : "text";
      
      currentMessage = {
        timestamp,
        sender: sender.trim(),
        content,
        type
      };
    } else if (currentMessage) {
      // If no match but we have a current message, consider this a continuation
      currentMessage.content += "\n" + line;
    }
  }
  
  // Add the last message if there is one
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return messages;
};

// Helper function to count word frequency
const countWordFrequency = (text: string): Record<string, number> => {
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  
  const wordCount: Record<string, number> = {};
  
  for (const word of words) {
    if (word.length > 2) { // Ignore very short words
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  }
  
  return wordCount;
};

// Helper function to count emoji frequency
const countEmojiFrequency = (text: string): Record<string, number> => {
  const emojiPattern = /[\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}]/gu;
  const emojis = text.match(emojiPattern) || [];
  
  const emojiCount: Record<string, number> = {};
  
  for (const emoji of emojis) {
    emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
  }
  
  return emojiCount;
};

// Simplified sentiment analysis (very basic)
const analyzeSentiment = (text: string): number => {
  const positiveWords = [
    "happy", "good", "great", "excellent", "wonderful", "amazing", "love", 
    "like", "best", "awesome", "fantastic", "beautiful", "perfect", "thank", 
    "thanks", "glad", "pleased", "joy", "exciting", "excited", "haha", "lol", "😊", "😄", "👍"
  ];
  
  const negativeWords = [
    "bad", "terrible", "awful", "horrible", "hate", "dislike", "worst", 
    "poor", "disappointed", "disappointing", "sad", "unhappy", "sorry", 
    "unfortunately", "fail", "failed", "problem", "issue", "angry", "mad", "😠", "😡", "👎"
  ];
  
  let score = 0;
  const lowercaseText = text.toLowerCase();
  
  for (const word of positiveWords) {
    if (lowercaseText.includes(word)) score += 1;
  }
  
  for (const word of negativeWords) {
    if (lowercaseText.includes(word)) score -= 1;
  }
  
  // Normalize between -1 and 1
  return score === 0 ? 0 : score / Math.max(Math.abs(score), 10);
};

// Analyze chat and extract personality traits
export const analyzeChatData = (messages: ChatMessage[]): ChatAnalysis => {
  if (!messages.length) {
    throw new Error("No messages to analyze");
  }

  // Extract unique participants
  const participants = [...new Set(messages.map(m => m.sender))];
  
  // Count messages by participant
  const messagesByParticipant: Record<string, number> = {};
  participants.forEach(p => {
    messagesByParticipant[p] = messages.filter(m => m.sender === p).length;
  });
  
  // Count media messages
  const mediaCount = messages.filter(m => m.type === "media").length;
  
  // Combine all message content for analysis
  const allContent = messages.map(m => m.content).join(" ");
  
  // Word frequency analysis
  const wordFrequency = countWordFrequency(allContent);
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }))
    .slice(0, 20);
  
  // Emoji analysis
  const emojiFrequency = countEmojiFrequency(allContent);
  const emojis = Object.keys(emojiFrequency);
  const sortedEmojis = Object.entries(emojiFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([emoji, count]) => ({ emoji, count }))
    .slice(0, 10);
  
  // Message time distribution (hour of day)
  const messageTimeDistribution: Record<string, number> = {};
  for (let i = 0; i < 24; i++) {
    messageTimeDistribution[i.toString()] = 0;
  }
  
  messages.forEach(message => {
    try {
      const timestamp = message.timestamp;
      const hourMatch = timestamp.match(/\d{1,2}:(\d{1,2})(?::\d{1,2})?/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        messageTimeDistribution[hour.toString()] = 
          (messageTimeDistribution[hour.toString()] || 0) + 1;
      }
    } catch (e) {
      // Ignore timestamp parsing errors
    }
  });
  
  // Calculate message stats
  const totalMessages = messages.length;
  const wordCount = allContent.split(/\s+/).length;
  const averageMessageLength = wordCount / totalMessages;
  
  // Sentiment analysis
  const sentimentScore = analyzeSentiment(allContent);
  
  // Personality analysis (simplified Big Five model)
  // This is a very simplified approximation
  const words = allContent.toLowerCase().split(/\s+/);
  
  // Very simplified word categories for personality traits
  const extraversionWords = ["we", "us", "together", "party", "friends", "social", "exciting", "fun", "outgoing"];
  const agreeablenessWords = ["please", "thank", "happy", "help", "appreciate", "kind", "good", "nice", "love"];
  const conscientiousnessWords = ["should", "must", "need", "responsibility", "work", "time", "plan", "organized"];
  const neuroticismWords = ["worried", "nervous", "stress", "anxiety", "fear", "sad", "upset", "sorry", "problem"];
  const opennessWords = ["wonder", "idea", "interesting", "curious", "imagine", "explore", "learn", "create", "art"];
  
  // Count trait words
  let extraversionCount = 0;
  let agreeablenessCount = 0;
  let conscientiousnessCount = 0;
  let neuroticismCount = 0;
  let opennessCount = 0;
  
  for (const word of words) {
    if (extraversionWords.includes(word)) extraversionCount++;
    if (agreeablenessWords.includes(word)) agreeablenessCount++;
    if (conscientiousnessWords.includes(word)) conscientiousnessCount++;
    if (neuroticismWords.includes(word)) neuroticismCount++;
    if (opennessWords.includes(word)) opennessCount++;
  }
  
  // Normalize scores between 0 and 1
  const maxCount = Math.max(extraversionCount, agreeablenessCount, conscientiousnessCount, neuroticismCount, opennessCount);
  const extraversion = maxCount ? extraversionCount / maxCount : 0;
  const agreeableness = maxCount ? agreeablenessCount / maxCount : 0;
  const conscientiousness = maxCount ? conscientiousnessCount / maxCount : 0;
  const neuroticism = maxCount ? neuroticismCount / maxCount : 0;
  const openness = maxCount ? opennessCount / maxCount : 0;
  
  // Determine dominant trait
  const traits = {
    extraversion,
    agreeableness,
    conscientiousness,
    neuroticism,
    openness
  };
  
  const dominant = Object.entries(traits)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  return {
    participantCount: participants.length,
    participants,
    messageCount: totalMessages,
    messagesByParticipant,
    wordCount,
    averageMessageLength,
    mediaCount,
    emojis,
    topWords: sortedWords,
    topEmojis: sortedEmojis,
    sentimentScore,
    messageTimeDistribution,
    personalityTraits: {
      extraversion,
      agreeableness,
      conscientiousness,
      neuroticism,
      openness,
      dominant
    }
  };
};
