import { InviteAction, InviteCategory } from '@app/models/event-registration.model';

export interface RegistrationData {
  relationCode?: number;
  relationName?: string;
  event: string;
  year: number;
  action?: InviteAction;
  category?: InviteCategory;
  persons?: number
  registered?: boolean;
  present?: number;

}
