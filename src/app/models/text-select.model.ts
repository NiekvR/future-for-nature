import { DivSelection } from '@app/models/div-selection.model';

export interface SelectedText {
  text: string;
  originalText: string;
  selected: DivSelection[];
}
