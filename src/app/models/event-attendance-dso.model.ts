export interface EventAttendanceDso {
  recordid: string;
  relatiecode: string;
  relatienaam: string;
  jaar: string;
  event: string;
  soortuitnodiging: string;
  aantalpersonenevent: string;
  aantalpersonendiner: string;
  placering: string;
  dieetwensen: string;
  afgemeldvoordefinitiefticket: string | number;
  afgemeldnadefinitiefticket: string | number;
  aanwezigopevent: string;
}
