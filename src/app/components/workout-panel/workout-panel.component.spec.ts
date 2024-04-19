import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutPanelComponent } from './workout-panel.component';

describe('WorkoutPanelComponent', () => {
  let component: WorkoutPanelComponent;
  let fixture: ComponentFixture<WorkoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
