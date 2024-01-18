import { InviteAction, InviteCategory } from '@app/models/event-registration.model';

export interface NewEventInvite {
  relationCode: number;
  name: string;
  nameBusinessRelation?: string;
  broughtInBy?: string;
  note?: string;
  email?: string;
  email2?: string;
  action?: InviteAction;
  category?: InviteCategory;
  tickets?: number;
  englishSalutation?: string;
  dutchSalutation?: string;
  headFamilieName?: string;
  presentLastYear?: number;
  presentYearBefore?: number;
}
