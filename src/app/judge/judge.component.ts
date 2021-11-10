import { Component, OnInit } from '@angular/core';
import { Application } from '@app/models/application.model';
import { ApplicationCollectionService } from '@app/core/application-collection.service';

@Component({
  selector: 'ffn-judge',
  templateUrl: './judge.component.html',
  styleUrls: ['./judge.component.scss']
})
export class JudgeComponent implements OnInit {

  public applications: Application[] | undefined;

  constructor(private applicationCollectionService: ApplicationCollectionService) {}

  ngOnInit() {
    this.getApplications();
  }

  private getApplications() {
    this.applicationCollectionService.getAll()
      .subscribe(applications => this.applications = applications);
  }

}
