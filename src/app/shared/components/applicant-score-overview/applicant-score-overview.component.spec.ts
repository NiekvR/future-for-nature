import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantScoreOverviewComponent } from './applicant-score-overview.component';

describe('ApplicantScoreOverviewComponent', () => {
  let component: ApplicantScoreOverviewComponent;
  let fixture: ComponentFixture<ApplicantScoreOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantScoreOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantScoreOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
