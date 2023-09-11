import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectApplicationComponent } from './select-application.component';

describe('SelectApplicationComponent', () => {
  let component: SelectApplicationComponent;
  let fixture: ComponentFixture<SelectApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
