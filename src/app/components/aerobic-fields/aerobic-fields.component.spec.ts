import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerobicFieldsComponent } from './aerobic-fields.component';

describe('AerobicFieldsComponent', () => {
  let component: AerobicFieldsComponent;
  let fixture: ComponentFixture<AerobicFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerobicFieldsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AerobicFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
