export interface Score {
  id?: string;
  applicationId: string;
  userId: string;
  total: string;
  subScores: { [id: string]: SubScore };
  submitted: boolean;
}

export interface SubScore {
  id: string;
  score?: number;
}
