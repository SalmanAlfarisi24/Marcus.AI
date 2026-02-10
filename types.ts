export type LanguageCode = 'ID' | 'EN' | 'JP' | 'ES' | 'DE';

export interface StoicAnalysis {
  facts: string[];
  opinions: string[];
  inControl: string[];
  outOfControl: string[];
  verdict: string;
}

export enum AppRoute {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  RESULT = 'RESULT',
  LOADING = 'LOADING',
  DEBATE = 'DEBATE',
}

export interface UserState {
  name: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
