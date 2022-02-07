import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantListItemComponent } from './applicant-list-item.component';

describe('ApplicantListItemComponent', () => {
  let component: ApplicantListItemComponent;
  let fixture: ComponentFixture<ApplicantListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
