import { Injectable } from '@angular/core';

import * as Papa from 'papaparse';
import { RegistrationData } from '@app/admin/crm/registration-data.model';
import { Event } from '@app/models/event.model';
import { Relation } from '@app/models/relation.model';
import { NewEventInvite } from '@app/admin/crm/new-event-invite.model';
import { InviteAction, InviteCategory } from '@app/models/event-registration.model';
import { Valuable } from '@app/admin/crm/file-import/valuable.model';

@Injectable({
  providedIn: 'root'
})
export class FileExportService {

  constructor() { }

  public downloadInviteCSV(registrationData: RegistrationData[], relations: Relation[], events: Event[]) {
    registrationData = registrationData.filter(data =>
      events.map(event => event.name).includes(data.event));
    const registrationCodes = [... new Set(registrationData.map(data => data.relationCode))];
    const newEventInvites = registrationCodes.map(code => {
      const relation = relations.find(relation => relation.relationCode === code)!;
      const data = registrationData.filter(data => data.relationCode === code);
      if(!!relation) {
        return this.createNewEventInvite(data, relation);
      } else {
        return undefined;
      }
    }).filter(invite => !!invite);
    this.downloadCSV(newEventInvites, 'event-invites');
  }

  public createNewEventInvite(registrationData: RegistrationData[], relation: Relation): NewEventInvite {
    const lastYearEvent = registrationData.find(data => data.year === 2023);
    const yearBeforeEvent = registrationData.find(data => data.year === 2022);
    return {
      relationCode: relation.relationCode,
      name: relation.relationName,
      nameBusinessRelation: relation.nameBusinessRelation,
      broughtInBy: relation.broughtInBy,
      note: relation.note,
      email: relation.email,
      email2: relation.email2,
      englishSalutation: relation.englishSalutation,
      dutchSalutation: relation.dutchSalutation,
      headFamilieName: relation.headFamilieName,
      action: !!lastYearEvent?.action ? lastYearEvent.action : yearBeforeEvent?.action,
      category: !!lastYearEvent?.category ? lastYearEvent.category : yearBeforeEvent?.category,
      tickets: !!lastYearEvent?.persons ? lastYearEvent.persons : yearBeforeEvent?.persons,
      presentLastYear: !!lastYearEvent ? lastYearEvent?.present : 0,
      presentYearBefore: !!yearBeforeEvent ? yearBeforeEvent?.present : 0
    }
  }

  public downloadCSV(array: any[], name: string) {
    const csv = Papa.unparse(array);

    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const csvURL = window.URL.createObjectURL(csvData);

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('event-invites', 'download.csv');
    tempLink.click();
  }

  private getValuable<
    // eslint-disable-next-line @typescript-eslint/ban-types
    T extends {},
    V = Valuable<T>,
  >(obj: T): V {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) =>
          !(
            (typeof v === 'string' && !v.length) ||
            v === null ||
            typeof v === 'undefined' ||
            v === 'NULL'
          ),
      ),
    ) as unknown as V;
  }
}
