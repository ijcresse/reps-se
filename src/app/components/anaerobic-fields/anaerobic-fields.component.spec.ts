import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaerobicFieldsComponent } from './anaerobic-fields.component';

describe('AnaerobicFieldsComponent', () => {
  let component: AnaerobicFieldsComponent;
  let fixture: ComponentFixture<AnaerobicFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnaerobicFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnaerobicFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
