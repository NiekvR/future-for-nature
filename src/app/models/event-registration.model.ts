export enum InviteAction {
  ffnfamily = 'FFN Family',
  yes = 'yes',
  yesPlus = 'yes +1',
  globeguards = 'globeguards',
  extraBatch = 'extra batch',
  doubt = 'doubt',
  extra = 'extra',
  dinner = 'dinner',
  dinnerPlus = 'dinner +1',
  vip = 'vip',
  vipPlus = 'vip +1',
  normal = 'normal',
  noInitialInvite = 'no initial invite'
}

export enum InviteCategory {
  dinner = 'diner',
  dinnerPlus = 'diner +1',
  vip = 'vip',
  vipPlus = 'vip +1',
  normal = 'normal',
  noEmail = 'noEmail',
  globeguards = 'globeguards',
  extraBatch = 'extraBatch',
  extra = 'extra',
  unknown = 'unknown',
  organization = 'organization',
  normalPlus = 'plus one'
}

export enum RegisteredCategory {
  yes = 'yes',
  canceled = 'canceled',
  unavailable = 'unavailable',
  unsubscribed = 'unsubscribed',
  hardBounce = 'hard bounce',
  softBounce = 'soft bounce'
}

export interface Registration {
  id?: string;
  relationCode?: number | undefined;
  event: string;
  relationName?: string;
  action?: InviteAction;
  category?: InviteCategory;
  persons?: number
  registrationCategory?: RegisteredCategory;
  registered?: boolean;
  present?: number;
  guest?: string;
  dinner?: boolean;
  guestDiner?: boolean;
  note?: string;
}
