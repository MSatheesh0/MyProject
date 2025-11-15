export interface Skill {
  icon: string;
  name: string;
  description: string;
  level: number; // Proficiency level from 0 to 100
}

export interface TimelineItem {
  title: string;
  institution: string;
  date: string;
  description: string;
  details?: string[];
  tags?: string[];
}

export interface Project {
  id: string;
  shortName: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  gradient: string; // Will be used for card background
  date: string;
  category: string;
  teamSize: string;
  role: string;
  status: string;
  overview: string;
  features: string[];
  implementation: string;
  images: {
    main: string;
    gallery: { src: string; title: string; desc: string; }[];
  };
}

export interface Certification {
  title: string;
  institution: string;
  date: string;
  description: string;
}

export interface TechnicalEvent {
    title: string;
    institution: string;
    date: string;
    description: string;
}

// Chatbot types
import { type Chat as GeminiChat } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ContextData {
  resume: string;
  linkedIn: string;
  githubUrl: string;
}

export type Chat = GeminiChat;
