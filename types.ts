export enum AppRoute {
  HUB = 'HUB',
  NEXUS_GEN = 'NEXUS_GEN',
  FLUX_EDIT = 'FLUX_EDIT',
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface AppConfig {
  id: AppRoute;
  name: string;
  description: string;
  version: string;
  icon: string; // Lucide icon name placeholder
}