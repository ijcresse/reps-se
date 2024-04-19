import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTemplatePanelComponent } from './add-template-panel.component';

describe('AddTemplatePanelComponent', () => {
  let component: AddTemplatePanelComponent;
  let fixture: ComponentFixture<AddTemplatePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTemplatePanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTemplatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
