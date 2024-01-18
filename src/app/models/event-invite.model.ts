export enum InviteType {
  vip = 'vip',
  invite = 'invite',
  unknown = 'unknown'
}

export interface EventInvite {
  relationCode: number;
  event: string;
  type: InviteType;
  personsEvent?: number;
  personsDiner?: number;
}
