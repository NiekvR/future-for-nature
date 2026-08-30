import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  public getAge(dateOfBirth: string): number {
    console.log(dateOfBirth)
    const dayOfMonthOfBirth = +dateOfBirth.split('-')[2];
    const monthOfBirth = +dateOfBirth.split('-')[1];
    const yearOfBirth = +dateOfBirth.split('-')[0];
    console.log(yearOfBirth, monthOfBirth, dayOfMonthOfBirth);
    const today = new Date();
    let age = today.getFullYear() - yearOfBirth;
    const month = today.getMonth() - monthOfBirth;
    if (month < 0 || (month === 0 && today.getDate() < dayOfMonthOfBirth)) {
      age--;
    }

    return age;
  }
}
