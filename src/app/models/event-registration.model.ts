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
  normalPlus = 'normal plus'
}

export interface Registration {
  id?: string;
  relationCode: number;
  event: string;
  action?: InviteAction;
  category?: InviteCategory;
  persons?: number
  registered?: boolean;
  present?: number;
}
