import { InviteType } from '@app/models/event-invite.model';

export interface EventInviteData {
  relationCode: number;
  relationName: string;
  event: string;
  year: number;
  type: InviteType;
  personsEvent?: number;
  personsDiner?: number;
}
