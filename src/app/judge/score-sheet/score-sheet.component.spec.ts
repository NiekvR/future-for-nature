import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSheetComponent } from './score-sheet.component';

describe('ScoreSheetComponent', () => {
  let component: ScoreSheetComponent;
  let fixture: ComponentFixture<ScoreSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
