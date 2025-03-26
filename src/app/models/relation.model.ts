export enum RelationType {
  personal = 'personal',
  businessRelation = 'business relation',
  supplier = 'supplier',
  unknown = 'unknown'
}

export enum RelationStatus {
  active = 'active',
  nonActive = 'Non-active'
}

export enum Membership {
  member = 'member',
  retiredMember = 'retired member',
  honoraryMember = 'honorary member',
  board = 'board member'
}

export enum ReasonNonActive {
  noContact = 'no contact',
  decedent = 'decedent'
}

export interface Relation {
  relationType?: RelationType;
  relationStatus: RelationStatus;
  relationCode: number;
  relationName: string;
  visit_address?: string;
  visit_postcode?: string;
  visit_city?: string;
  visit_landcode?: string;
  post_address?: string;
  post_postcode?: string;
  post_city?: string;
  post_landcode?: string;
  email?: string;
  email2?: string;
  phone?: string;
  phone2?: string;
  phone3?: string;
  website?: string;
  dayOfBirth?: Date;
  firstNames?: string;
  callSign?: string;
  infix?: string;
  lastName?: string;
  dietaryRequirements?: string;
  dutchSalutation?: string;
  englishSalutation?: string;
  board?: Membership;
  team?: Membership;
  nsc?: Membership;
  isc?: Membership;
  rva?: Membership;
  ffnFriend?: Membership;
  globeGuard?: Membership;
  winner?: number;
  functionBusinessRelation?: string;
  reasonNonActive?: ReasonNonActive;
  broughtInBy?: string;
  oldDonors?: boolean;
  natureOrganisation?: boolean;
  extraFamilyInvite?: boolean;
  headBusinessRelation?: boolean;
  ffnFriendCancelDate?: Date;
  relationCodeBusinessRelation?: number;
  nameBusinessRelation?: string;
  relationCodeBusinessRelationExtra?: number;
  nameBusinessRelationExtra?: string;
  note?: string;
  iban?: string;
  headFamilyCode?: number;
  headFamilieName?: string;
  id?: string;
}
