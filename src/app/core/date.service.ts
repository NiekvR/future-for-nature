import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  public toDate(dateString: string, format = 'DD-MM-YYYY'): Date {
    return moment(dateString, format).toDate();
  }
}
