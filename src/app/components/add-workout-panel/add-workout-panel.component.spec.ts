import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkoutPanelComponent } from './add-workout-panel.component';

describe('AddWorkoutPanelComponent', () => {
  let component: AddWorkoutPanelComponent;
  let fixture: ComponentFixture<AddWorkoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkoutPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWorkoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
