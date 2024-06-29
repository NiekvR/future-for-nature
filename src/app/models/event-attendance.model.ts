export enum DeregisteredType {
  beforeTicket = 'beforeTicket',
  afterTicket = 'afterTicket',
}

export enum Placement {
  hall = 'hall',
  byName = 'byName',
  reserved = 'reserved'
}

export interface EventAttendance {
  relationCode: number;
  event: string;
  personsEvent?: number;
  personsDiner?: number;
  placement?: Placement;
  deregistered?: DeregisteredType;
  present?: boolean;
}
