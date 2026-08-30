import { Injectable } from '@angular/core';
import { combineLatest, filter, Observable, Subject, take } from 'rxjs';
import { Application, Name, Referee } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';
import { ApplicationDBO } from '@app/models/applicationDBO.model';

import * as Papa from 'papaparse';
import {ApplicationService} from "@app/core/application.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private applicationCollectionService: ApplicationCollectionService,
              private applicationService: ApplicationService,) {
  }

  public getApplicantsFromCSV(file: File): Observable<ApplicationDBO[]> {
    const subject = new Subject<ApplicationDBO[]>();
    Papa.parse<ApplicationDBO>(file, {
      header: true,
      transformHeader(header: string, index: number): string {
        return header
          .trim()
          .replace(/\s/g, '')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/\//g, '')
          .replace(/\./g, '')
          .replace(/;/g, '')
          .replace(/,/g, '')
          .replace(/["']/g, '')
          .replace(/\?/g, '')
          .toLowerCase();
      },
      complete: function (results) {
        console.log(results);
        subject.next(results.data);
        subject.complete();
      }
    });

    return subject.asObservable().pipe(filter(applicants => !!applicants));
  }

  public applicantsDBOtoApplication(applicationDBOs: ApplicationDBO[]): Application[] {
    console.log(applicationDBOs);
    return applicationDBOs
      .map(applicationDBO => this.getApplicationDBOToApplication(applicationDBO))
      .filter(application => application.name.fullName.trim().length > 0);
  }

  public addApplicantsToDB(applications: Application[]): Observable<any> {
    return combineLatest(applications.map(application => this.addApplicantToDb(application).pipe(take(1))));
  }

  public updateApplicantsToDB(applications: Application[]): Observable<any> {
    return combineLatest(applications.map(application => this.updateApplicantToDb(application)));
  }

  public deleteApplicantsFromDB(): Observable<boolean> {
    return this.applicationCollectionService.clearCollection();
  }

  public exportScoresAsCsv(scores: { [column: string]: string }[], userName: string) {
    const csv = Papa.unparse(scores);

    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    let csvURL = window.URL.createObjectURL(csvData);

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', `${userName}_scores_${this.getDate()}.csv`);
    tempLink.click();
  }

  public getFromCSV<T>(file: File): Observable<T[]> {
    const subject = new Subject<any[]>();
    Papa.parse<T>(file, {
      header: true,
      transformHeader(header: string, index: number): string {
        return header
          .trim()
          .replace(/\s/g, '')
          .replace(/\(/g, '')
          .replace(/\)/g, '')
          .replace(/["']/g, '')
          .replace(/\?/g, '')
          .toLowerCase();
      },
      complete: function (results) {
        subject.next(results.data);
        subject.complete();
      }
    });

    return subject.asObservable().pipe(filter(applicants => !!applicants));
  }

  public getHeadersFromCSV<T>(file: File): Observable<string[]> {
    const subject = new Subject<any[]>();
    Papa.parse<T>(file, {
      header: true,
      complete: function (results) {
        subject.next(results.meta.fields!);
        subject.complete();
      }
    });

    return subject.asObservable().pipe(filter(applicants => !!applicants));
  }

  private addApplicantToDb(application: Application): Observable<Application> {
    return this.applicationCollectionService.add(application);
  }

  private updateApplicantToDb(application: Application): Observable<Application> {
    return this.applicationCollectionService.update(application)
  }

  private getApplicationDBOToApplication(applicationDBO: ApplicationDBO): Application {
    const application = {} as Application;
    application.ffnId = applicationDBO.entryid || '';
    application.name = this.getNameFromApplicationDBO(applicationDBO);
    application.nationality = applicationDBO.nationality || '';
    application.countryOfWork = applicationDBO.countryofwork || '';
    application.focalSpecies = applicationDBO.focalspecies || '';
    application.scientificName = applicationDBO.scientificnamesofthefocalspecies || '';
    application.dateOfBirth = applicationDBO.dateofbirth || '';
    application.age = '' + this.applicationService.getAge(applicationDBO.dateofbirth);
    application.gender = applicationDBO.gender || '';
    application.nativeLanguage = applicationDBO.nativelanguage || '';
    application.englishProficiency = applicationDBO.englishproficiency || '';
    application.inspiration = applicationDBO.candidatesachievementswhatinspiredyoutogetintonatureconservationandspecificallytothisspecies || '';
    application.contributionsMade = applicationDBO.candidatesachievementsoutlineconcretecontributionsyouhavepersonallymaderegardingspeciesprotectionincludingwhyyoufocusedonthisspecificspeciesandareatowhatextentdidthethreatenedstatuslocallyregionallyorgloballyofthespeciesplayaroleifanyofyourdecisionsinthepastdidnotturnoutasyouhopedforexampleintermsofprojectprogressenvisionedimpactormediaattentionpleasementionithereaswelltogetherwiththelessonslearned || '';
    application.formalEducation = applicationDBO.formaleducation || '';
    application.employmentRecord = applicationDBO.employmentrecord || '';
    application.formerApplications = applicationDBO.formerffnawardapplications || '';
    application.otherAwards = applicationDBO.otherawards || '';
    application.achievements = applicationDBO.candidatesachievementswhyshouldyoureceivethefuturefornatureaward || '';
    application.problems = applicationDBO.conservationvisionwhataretheconservationproblemsyouwilltrytosolvehowaretheyembeddedinthelocalregionalglobalcontextandhowwillyouaimtosolvethem || '';
    application.vision = applicationDBO.conservationvisionwhatstrategiesguideyourworkandwhydidyoudeterminethisapproachtobethemosteffective || '';
    application.addedValue = applicationDBO.addedvalueoftheffnaward || '';
    application.additionalInformation = applicationDBO.additionalinformation || '';
    application.referee = [
      this.getReferee1FromApplicationDBO(applicationDBO),
      this.getReferee2FromApplicationDBO(applicationDBO)];
    application.notUsedAi = applicationDBO.ihavenotusedaitoolsinthewritingofthisapplication;
    application.aiForLanguage = applicationDBO.ihaveusedaitoolsonlyforlanguageimprovementseggrammarspellinglanguageandconfirmthatthecontentisentirelymyown;
    application.aiForIdeas = applicationDBO.ihaveusedaitoolsinthewritingofthisapplicationforideagenerationstructuringorpartialrewritingoftheapplicationtexttheresultingapplicationincludingtheideasexperiencesandfinalcontentarefullyreflectingmyownachievementsideasopinionsandvision;
    application.aiForDrafts = applicationDBO.ihaveusedaitoolsextensivelytogenerateordraftpartsofthisapplicationwhileihavereviewedthecontentitmaynotfullyreflectmyownwordingideasorachievementscorrectly;
    application.aiUnsure = applicationDBO.iamunsurehowtoclassifymyuseofaitools;


    return application;
  }

  private getReferee1FromApplicationDBO(applicationDBO: ApplicationDBO): Referee {
    const referee = {} as Referee;
    referee.name = this.getReferee1NameFromApplicationDBO(applicationDBO);
    referee.position = applicationDBO.positionreferee1 || '';
    referee.organisation = applicationDBO.organisationreferee1 || '';
    referee.statement = applicationDBO.referenceletter1 || '';
    return referee;
  }

  private getReferee1NameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const refereeName = {} as Name;
    refereeName.prefix = applicationDBO.referee1prefix || '';
    refereeName.firstName = applicationDBO.referee1firstname || '';
    refereeName.middleName = applicationDBO.referee1middle || '';
    refereeName.surName = applicationDBO.referee1surname || '';
    refereeName.suffix = applicationDBO.referee1suffix || '';
    return this.getFullName(refereeName);
  }

  private getReferee2FromApplicationDBO(applicationDBO: ApplicationDBO): Referee {
    const referee = {} as Referee;
    referee.name = this.getReferee2NameFromApplicationDBO(applicationDBO);
    referee.position = applicationDBO.positionreferee2 || '';
    referee.organisation = applicationDBO.organisationreferee2 || '';
    referee.statement = applicationDBO.referenceletter2 || '';
    return referee;
  }

  private getReferee2NameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const refereeName = {} as Name;
    refereeName.prefix = applicationDBO.referee2prefix || '';
    refereeName.firstName = applicationDBO.referee2firstname || '';
    refereeName.middleName = applicationDBO.referee2middle || '';
    refereeName.surName = applicationDBO.referee2surname || '';
    refereeName.suffix = applicationDBO.referee2suffix || '';
    return this.getFullName(refereeName);
  }

  private getNameFromApplicationDBO(applicationDBO: ApplicationDBO): Name {
    const name = {} as Name;
    name.firstName = applicationDBO.namefirstname || '';
    name.middleName = applicationDBO.namemiddle || '';
    name.surName = applicationDBO.namesurname || '';
    name.suffix = applicationDBO.namesuffix || '';
    return this.getFullName(name);
  }

  private getFullName(name: Name): Name {
    name.fullName = `${name.suffix} ${name.firstName} ${name.middleName} ${name.surName}`
    return name
  }

  private getDate(): string {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
