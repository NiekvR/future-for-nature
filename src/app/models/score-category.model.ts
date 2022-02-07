export interface ScoreCategory {
  id: string;
  name: string;
  score?: number;
  subs?: ScoreCategory[];
}
