import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserScoresOverviewComponent } from './user-scores-overview.component';

describe('UserScoresOverviewComponent', () => {
  let component: UserScoresOverviewComponent;
  let fixture: ComponentFixture<UserScoresOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserScoresOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScoresOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
