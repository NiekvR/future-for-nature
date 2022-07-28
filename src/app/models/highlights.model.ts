import { SelectedText } from '@app/models/text-select.model';

export interface Highlights {
  id?: string;
  userId: string;
  applicationId: string;
  highlights: { [id: string ]: SelectedText}
}
