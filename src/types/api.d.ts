// Basic API type declarations to guide migration to TypeScript.

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  suggestion?: string;
  originalSnippet?: string;
  fixedSnippet?: string;
}

export interface Review {
  id: string;
  score?: number;
  summary?: string;
  improvedCode?: string;
  explanation?: string;
  issues?: Issue[];
  tests?: Array<{ input: string; expectedOutput: string; description?: string }>;
  metadata?: Record<string, any>;
}

export interface UploadResponse {
  content: string;
  language: string;
}

export interface HealthResponse {
  healthy: boolean;
  providers?: Record<string, boolean>;
}

export interface AnalyticsResponse {
  totalReviews: number;
  avgScore?: number;
  byType?: Record<string, number>;
}
