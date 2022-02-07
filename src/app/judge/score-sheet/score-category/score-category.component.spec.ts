import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCategoryComponent } from './score-category.component';

describe('ScoreCategoryComponent', () => {
  let component: ScoreCategoryComponent;
  let fixture: ComponentFixture<ScoreCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
