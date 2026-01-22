import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRelationComponent } from './edit-relation.component';

describe('EditRelationComponent', () => {
  let component: EditRelationComponent;
  let fixture: ComponentFixture<EditRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRelationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
