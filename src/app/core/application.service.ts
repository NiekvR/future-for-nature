import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor() { }

  public getAge(dateOfBirth: string): number {
    const dateOfBirthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirthDate.getFullYear();
    const month = today.getMonth() - dateOfBirthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dateOfBirthDate.getDate())) {
      age--;
    }

    return age;
  }
}
