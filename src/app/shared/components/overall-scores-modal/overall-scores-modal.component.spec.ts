import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallScoresModalComponent } from './overall-scores-modal.component';

describe('OverallScoresModalComponent', () => {
  let component: OverallScoresModalComponent;
  let fixture: ComponentFixture<OverallScoresModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallScoresModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallScoresModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
