
import { PersonalityTraits } from "./whatsAppParser";

export interface AvatarAttributes {
  head: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  accessories: string;
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  skinTone: string;
  background: string;
}

// Map personality traits to avatar characteristics
export const generateAvatarAttributes = (traits: PersonalityTraits): AvatarAttributes => {
  // Base attributes
  const baseAttributes: AvatarAttributes = {
    head: "round",
    eyes: "default",
    eyebrows: "default",
    mouth: "default",
    accessories: "none",
    hairStyle: "short",
    hairColor: "#5E3B28",
    facialHair: "none",
    skinTone: "#F8D5C2",
    background: "#FFFFFF"
  };
  
  // Adjust based on dominant personality trait
  switch (traits.dominant) {
    case "extraversion":
      // Extraverts are outgoing, energetic, talkative
      return {
        ...baseAttributes,
        eyes: "wide",
        eyebrows: "raised",
        mouth: "big-smile",
        hairStyle: "wild",
        hairColor: "#FF9500",
        background: "#FFE082"
      };
      
    case "agreeableness":
      // Agreeable people are friendly, compassionate, cooperative
      return {
        ...baseAttributes,
        eyes: "round",
        eyebrows: "relaxed",
        mouth: "smile",
        accessories: "none",
        hairStyle: "wavy",
        hairColor: "#8D6E63",
        skinTone: "#FFE0B2",
        background: "#E1F5FE"
      };
      
    case "conscientiousness":
      // Conscientious people are organized, responsible, hardworking
      return {
        ...baseAttributes,
        eyes: "focused",
        eyebrows: "straight",
        mouth: "neutral",
        accessories: "glasses",
        hairStyle: "neat",
        hairColor: "#3E2723",
        skinTone: "#FFF9C4",
        background: "#E8F5E9"
      };
      
    case "neuroticism":
      // Neurotic people experience negative emotions more frequently
      return {
        ...baseAttributes,
        eyes: "worried",
        eyebrows: "worried",
        mouth: "slight-frown",
        hairStyle: "messy",
        hairColor: "#37474F",
        skinTone: "#EFEBE9",
        background: "#F3E5F5"
      };
      
    case "openness":
      // Open people are creative, curious, and appreciate art
      return {
        ...baseAttributes,
        eyes: "curious",
        eyebrows: "expressive",
        mouth: "thoughtful",
        accessories: "earring",
        hairStyle: "artistic",
        hairColor: "#7E57C2",
        skinTone: "#FFF3E0",
        background: "#BBDEFB"
      };
      
    default:
      return baseAttributes;
  }
};

// SVG renderer for the avatar
export const renderAvatar = (attributes: AvatarAttributes): string => {
  return `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="400" height="400" fill="${attributes.background}" rx="20" ry="20"/>
      
      <!-- Head -->
      <ellipse cx="200" cy="200" rx="120" ry="140" fill="${attributes.skinTone}"/>
      
      <!-- Hair -->
      ${renderHair(attributes.hairStyle, attributes.hairColor)}
      
      <!-- Eyes -->
      ${renderEyes(attributes.eyes)}
      
      <!-- Eyebrows -->
      ${renderEyebrows(attributes.eyebrows)}
      
      <!-- Mouth -->
      ${renderMouth(attributes.mouth)}
      
      <!-- Facial Hair -->
      ${renderFacialHair(attributes.facialHair)}
      
      <!-- Accessories -->
      ${renderAccessories(attributes.accessories)}
    </svg>
  `;
};

// Helper functions to render different avatar parts
const renderHair = (style: string, color: string): string => {
  switch (style) {
    case "short":
      return `
        <path d="M100,130 C120,80 180,70 200,70 C220,70 280,80 300,130 C300,130 270,120 200,120 C130,120 100,130 100,130 Z" fill="${color}"/>
      `;
    case "wild":
      return `
        <path d="M90,140 C110,70 180,50 200,50 C220,50 290,70 310,140 C320,160 330,130 340,150 C350,170 330,190 320,180 C320,180 280,110 200,110 C120,110 80,180 80,180 C70,190 50,170 60,150 C70,130 80,160 90,140 Z" fill="${color}"/>
      `;
    case "wavy":
      return `
        <path d="M100,130 C120,80 180,70 200,70 C220,70 280,80 300,130 C300,130 270,110 250,120 C230,130 220,110 200,120 C180,130 170,110 150,120 C130,130 100,130 100,130 Z" fill="${color}"/>
      `;
    case "neat":
      return `
        <path d="M110,120 C130,80 180,70 200,70 C220,70 270,80 290,120 C290,120 260,110 200,110 C140,110 110,120 110,120 Z" fill="${color}"/>
      `;
    case "messy":
      return `
        <path d="M100,130 C120,80 180,60 200,60 C220,60 280,80 300,130 C300,130 310,100 305,80 C300,60 280,70 290,50 C300,30 270,40 250,60 C230,40 210,50 200,40 C190,50 170,40 150,60 C130,40 100,30 110,50 C120,70 100,60 95,80 C90,100 100,130 100,130 Z" fill="${color}"/>
      `;
    case "artistic":
      return `
        <path d="M100,130 C120,80 180,70 200,70 C220,70 280,80 300,130 C320,150 330,100 310,80 C290,60 320,40 290,30 C260,20 230,60 200,30 C170,60 140,20 110,30 C80,40 110,60 90,80 C70,100 80,150 100,130 Z" fill="${color}"/>
      `;
    default:
      return `
        <path d="M100,130 C120,80 180,70 200,70 C220,70 280,80 300,130 C300,130 270,120 200,120 C130,120 100,130 100,130 Z" fill="${color}"/>
      `;
  }
};

const renderEyes = (style: string): string => {
  switch (style) {
    case "wide":
      return `
        <ellipse cx="150" cy="180" rx="20" ry="15" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="20" ry="15" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="150" cy="180" r="10" fill="#663300"/>
        <circle cx="250" cy="180" r="10" fill="#663300"/>
        <circle cx="153" cy="177" r="3" fill="white"/>
        <circle cx="253" cy="177" r="3" fill="white"/>
      `;
    case "round":
      return `
        <ellipse cx="150" cy="180" rx="15" ry="15" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="15" ry="15" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="150" cy="180" r="8" fill="#663300"/>
        <circle cx="250" cy="180" r="8" fill="#663300"/>
        <circle cx="152" cy="178" r="2" fill="white"/>
        <circle cx="252" cy="178" r="2" fill="white"/>
      `;
    case "focused":
      return `
        <ellipse cx="150" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="150" cy="180" r="7" fill="#30230c"/>
        <circle cx="250" cy="180" r="7" fill="#30230c"/>
        <circle cx="152" cy="178" r="2" fill="white"/>
        <circle cx="252" cy="178" r="2" fill="white"/>
      `;
    case "worried":
      return `
        <ellipse cx="150" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="150" cy="182" r="7" fill="#4b3621"/>
        <circle cx="250" cy="182" r="7" fill="#4b3621"/>
        <circle cx="152" cy="180" r="2" fill="white"/>
        <circle cx="252" cy="180" r="2" fill="white"/>
      `;
    case "curious":
      return `
        <ellipse cx="150" cy="180" rx="17" ry="14" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="17" ry="14" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="155" cy="180" r="9" fill="#5c4033"/>
        <circle cx="245" cy="180" r="9" fill="#5c4033"/>
        <circle cx="157" cy="177" r="3" fill="white"/>
        <circle cx="247" cy="177" r="3" fill="white"/>
      `;
    default:
      return `
        <ellipse cx="150" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <ellipse cx="250" cy="180" rx="15" ry="12" fill="white" stroke="#000" stroke-width="2"/>
        <circle cx="150" cy="180" r="7" fill="#663300"/>
        <circle cx="250" cy="180" r="7" fill="#663300"/>
        <circle cx="152" cy="178" r="2" fill="white"/>
        <circle cx="252" cy="178" r="2" fill="white"/>
      `;
  }
};

const renderEyebrows = (style: string): string => {
  switch (style) {
    case "raised":
      return `
        <path d="M130,155 C140,145 160,145 170,155" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,155 C240,145 260,145 270,155" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "relaxed":
      return `
        <path d="M130,160 C140,155 160,155 170,160" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,160 C240,155 260,155 270,160" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "straight":
      return `
        <path d="M130,160 C140,160 160,160 170,160" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,160 C240,160 260,160 270,160" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "worried":
      return `
        <path d="M130,160 C140,150 160,155 170,160" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,160 C240,155 260,150 270,160" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "expressive":
      return `
        <path d="M130,155 C140,145 160,150 170,155" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,155 C240,150 260,145 270,155" stroke="#000" stroke-width="3" fill="none"/>
      `;
    default:
      return `
        <path d="M130,155 C140,150 160,150 170,155" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M230,155 C240,150 260,150 270,155" stroke="#000" stroke-width="3" fill="none"/>
      `;
  }
};

const renderMouth = (style: string): string => {
  switch (style) {
    case "big-smile":
      return `
        <path d="M150,240 C175,270 225,270 250,240" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M160,250 C180,265 220,265 240,250" fill="#FF9999"/>
      `;
    case "smile":
      return `
        <path d="M160,240 C180,255 220,255 240,240" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "neutral":
      return `
        <path d="M160,240 C180,242 220,242 240,240" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "slight-frown":
      return `
        <path d="M160,245 C180,240 220,240 240,245" stroke="#000" stroke-width="3" fill="none"/>
      `;
    case "thoughtful":
      return `
        <path d="M170,240 C185,245 215,245 230,240" stroke="#000" stroke-width="3" fill="none"/>
      `;
    default:
      return `
        <path d="M160,240 C180,250 220,250 240,240" stroke="#000" stroke-width="3" fill="none"/>
      `;
  }
};

const renderFacialHair = (style: string): string => {
  switch (style) {
    case "beard":
      return `
        <path d="M140,230 C170,280 230,280 260,230 C260,260 240,300 200,300 C160,300 140,260 140,230 Z" fill="#5E3B28" opacity="0.7"/>
      `;
    case "mustache":
      return `
        <path d="M160,230 C180,220 220,220 240,230 C220,240 180,240 160,230 Z" fill="#5E3B28"/>
      `;
    case "goatee":
      return `
        <path d="M190,245 C195,260 205,260 210,245 C210,260 200,280 190,245 Z" fill="#5E3B28"/>
      `;
    default:
      return "";
  }
};

const renderAccessories = (accessory: string): string => {
  switch (accessory) {
    case "glasses":
      return `
        <rect x="135" y="170" width="35" height="20" rx="5" ry="5" fill="none" stroke="#000" stroke-width="2"/>
        <rect x="230" y="170" width="35" height="20" rx="5" ry="5" fill="none" stroke="#000" stroke-width="2"/>
        <path d="M170,180 L230,180" stroke="#000" stroke-width="2" fill="none"/>
      `;
    case "sunglasses":
      return `
        <rect x="135" y="170" width="35" height="20" rx="5" ry="5" fill="#333" stroke="#000" stroke-width="1"/>
        <rect x="230" y="170" width="35" height="20" rx="5" ry="5" fill="#333" stroke="#000" stroke-width="1"/>
        <path d="M170,178 L230,178" stroke="#000" stroke-width="2" fill="none"/>
      `;
    case "earring":
      return `
        <circle cx="100" cy="200" r="5" fill="gold" stroke="#000" stroke-width="1"/>
      `;
    default:
      return "";
  }
};
