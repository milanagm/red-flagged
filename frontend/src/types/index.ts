export interface Message {
    timestamp: string;
    sender: string;
    content: string;
}

export interface PersonalityTraits {
    extraversion: number;
    agreeableness: number;
    conscientiousness: number;
    neuroticism: number;
    openness: number;
}

export interface HogwartsAnalysis {
    house: string;
    confidence: number;
    analysis: string;
}

export interface RedFlagAnalysis {
    red_flag_level: string;
    confidence: number;
    analysis: string;
    identified_flags: string[];
}

export interface ChatAnalysis {
    hogwartsAnalysis?: HogwartsAnalysis;
    redFlagAnalysis?: RedFlagAnalysis;
    personalityTraits: PersonalityTraits;
}

export interface AvatarAttributes {
    hairStyle: string;
    hairColor: string;
    eyeColor: string;
    skinTone: string;
    facialFeatures: string[];
    accessories: string[];
    expression: string;
    pose: string;
}

export interface HogwartsResponse {
    house: string;
    confidence: number;
    analysis: string;
}

export interface RedFlagResponse {
    red_flag_level: string;
    confidence: number;
    analysis: string;
    identified_flags: string[];
}

export type AnalysisResponse = HogwartsResponse | RedFlagResponse; 