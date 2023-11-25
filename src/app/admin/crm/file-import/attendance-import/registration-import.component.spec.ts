import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationImportComponent } from './registration-import.component';

describe('AttendanceImportComponent', () => {
  let component: RegistrationImportComponent;
  let fixture: ComponentFixture<RegistrationImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
