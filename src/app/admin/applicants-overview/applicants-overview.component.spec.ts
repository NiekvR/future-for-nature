import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsOverviewComponent } from './applicants-overview.component';

describe('ApplicantsOverviewComponent', () => {
  let component: ApplicantsOverviewComponent;
  let fixture: ComponentFixture<ApplicantsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
