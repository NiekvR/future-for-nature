import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { combineLatest, Observable, tap } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Application, Name, PostalAddress, Referee } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { ApplicationDBO } from '@app/models/applicationDBO.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private storage: AngularFireStorage, private angularFireFunctions: AngularFireFunctions,
              private applicationCollectionService: ApplicationCollectionService) { }

  public uploadFile(file: File, path: string, metadata?: {}): Observable<string> {
    return new Observable<string>(observer => {
      this.storage.upload(path, file, metadata).then(
        () => {
          const fileRef = this.storage.ref(path);
          fileRef.getMetadata().subscribe();
          fileRef.getDownloadURL()
            .subscribe((url) => {
              observer.next(url);
              observer.complete();
            });
        },
        (error) => console.log(error)
      );
    });
  }

  public addApplicantsToStorage(link: string) {
    const callable = this.angularFireFunctions.httpsCallable('uploadApplicants');
    return callable({ csv: link } );
  }

  public addApplicantsToDB(applicationDBOs: ApplicationDBO[]): Observable<any> {
    return combineLatest(applicationDBOs.map(applicationDBO => this.addApplicantToDb(applicationDBO)));
  }

  public deleteApplicantsFromDB(): Observable<boolean> {
    return this.applicationCollectionService.clearCollection();
  }

  private addApplicantToDb(applicationDBO: ApplicationDBO): Observable<Application> {
    return this.applicationCollectionService.add(this.getApplicationDBOToApplication(applicationDBO));
  }

  private getApplicationDBOToApplication(applicationDBO: ApplicationDBO): Application {
    console.log(applicationDBO);
    const application = {} as Application;
    application.ffnId = applicationDBO['Entry Id'] || '';
    application.name = this.getNameFromApplicationDBO(applicationDBO);
    application.nationality = applicationDBO.Nationality || '';
    application.countryOfWork = applicationDBO['Country of work'] || '';
    application.focalSpecies = applicationDBO['Focal species'] || '';
    application.dateOfBirth = applicationDBO['Date of birth'] || '';
    application.gender = applicationDBO.Gender || '';
    application.nativeLanguage = applicationDBO['Native language'] || '';
    application.englishProficiency = applicationDBO['English proficiency'] || '';
    application.formalEducation = applicationDBO['Formal education'] || '';
    application.employmentRecord = applicationDBO['Employment record'] || '';
    application.formerApplications = applicationDBO['Former FFN Award applications'] || '';
    application.otherAwards = applicationDBO['Other awards'] || '';
    application.achievements = applicationDBO['Candidate\'s achievements'] || '';
    application.vision = applicationDBO['Conservation vision'] || '';
    application.addedValue = applicationDBO['Added value of the FFN Award'] || '';
    application.additionalInformation = applicationDBO['Additional information'] || '';
    application.referee = [
      this.getReferee1FromApplicationDBO(applicationDBO),
      this.getReferee2FromApplicationDBO(applicationDBO)];

    return application;
  }

  private getReferee1FromApplicationDBO(applicationDBO: ApplicationDBO): Referee {
    const referee = {} as Referee;
    referee.name = this.getReferee1NameFromApplicationDBO(applicationDBO);
    referee.position = applicationDBO['Position referee 1'] || '';
    referee.organisation = applicationDBO['Organisation referee 1'] || '';
    referee.statement = applicationDBO['Reference statement referee 1'] || '';
    return referee;
  }

  private getReferee1NameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const refereeName = {} as Name;
    refereeName.prefix = applicationDBO['Referee 1 (Prefix)'] || '';
    refereeName.firstName = applicationDBO['Referee 1 (First name)'] || '';
    refereeName.middleName = applicationDBO['Referee 1 (Middle)'] || '';
    refereeName.surName = applicationDBO['Referee 1 (Surname)'] || '';
    refereeName.suffix = applicationDBO['Referee 1 (Suffix)'] || '';
    return this.getFullName(refereeName);
  }

  private getReferee2FromApplicationDBO(applicationDBO: ApplicationDBO): Referee {
    const referee = {} as Referee;
    referee.name = this.getReferee2NameFromApplicationDBO(applicationDBO);
    referee.position = applicationDBO['Position referee 2'];
    referee.organisation = applicationDBO['Organisation referee 2'];
    referee.statement = applicationDBO['Reference statement referee 2'];
    return referee;
  }

  private getReferee2NameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const refereeName = {} as Name;
    refereeName.prefix = applicationDBO['Referee 2 (Prefix)'] || '';
    refereeName.firstName = applicationDBO['Referee 2 (First name)'] || '';
    refereeName.middleName = applicationDBO['Referee 2 (Middle)'] || '';
    refereeName.surName = applicationDBO['Referee 2 (Surname)'] || '';
    refereeName.suffix = applicationDBO['Referee 2 (Suffix)'] || '';
    return this.getFullName(refereeName);
  }

  private getNameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const name = {} as Name;
    name.prefix = applicationDBO['" (Prefix)"'] || '';
    name.firstName = applicationDBO[' (First name)'] || '';
    name.middleName = applicationDBO[' (Middle)'] || '';
    name.surName = applicationDBO[' (Surname)'] || '';
    name.suffix = applicationDBO[' (Suffix)'] || '';
    return this.getFullName(name);
  }

  private getPostalAddressFromApplicationDBO(applicationDBO: ApplicationDBO): PostalAddress {
    const address = {} as PostalAddress;
    address.streetAddress = applicationDBO['Postal address (Street Address)'] || '';
    address.addressLine2 = applicationDBO['Postal address (Address Line 2)'] || '';
    address.postalCode = applicationDBO['Postal address (ZIP / Postal Code)'] || '';
    address.city = applicationDBO['Postal address (City)'] || '';
    address.state = applicationDBO['Postal address (State / Province)'] || '';
    address.country = applicationDBO['Postal address (Country)'] || '';
    return address;
  }

  private getFullName(name: Name): Name {
    name.fullName = `${name.suffix} ${name.firstName} ${name.middleName} ${name.surName}`
    return name
  }
}
