import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  public getAge(dateOfBirth: string): number {
    const yearOfBirth = +dateOfBirth.split('/')[2];
    const monthOfBirth = +dateOfBirth.split('/')[1];
    const dayOfMonthOfBirth = +dateOfBirth.split('/')[0];
    const today = new Date();
    let age = today.getFullYear() - yearOfBirth;
    const month = today.getMonth() - monthOfBirth;
    if (month < 0 || (month === 0 && today.getDate() < dayOfMonthOfBirth)) {
      age--;
    }

    return age;
  }
}
