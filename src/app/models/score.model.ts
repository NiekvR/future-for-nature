export interface Score {
  id?: string;
  applicationId: string;
  userId: string;
  total: string;
  subScores: { [id: string]: SubScore };
  pristine: boolean;
  submitted: boolean;
  skipped: boolean;
  comments?: string;
}

export interface SubScore {
  id: string;
  score?: number | null;
}
