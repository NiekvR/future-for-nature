export interface ScoreCategory {
  id: string;
  name: string;
  relevance?: number;
  info?: string;
  score?: number;
  subs?: ScoreCategory[];
}
