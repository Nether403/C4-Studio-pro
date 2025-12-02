export interface HistoryItem {
  id: string;
  timestamp: number;
  originalImage: string | null; // Base64
  prompt: string;
  code: string;
  thumbnail: string | null; // Small preview or same as original
}

export interface GenerationRequest {
  image: string | null; // Base64
  prompt: string;
}

export type ViewMode = 'split' | 'preview' | 'code';
