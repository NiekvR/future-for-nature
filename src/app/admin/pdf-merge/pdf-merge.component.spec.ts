import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfMergeComponent } from './pdf-merge.component';

describe('PdfMergeComponent', () => {
  let component: PdfMergeComponent;
  let fixture: ComponentFixture<PdfMergeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfMergeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
