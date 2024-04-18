import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutInstanceComponent } from './workout-instance.component';

describe('WorkoutInstanceComponent', () => {
  let component: WorkoutInstanceComponent;
  let fixture: ComponentFixture<WorkoutInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutInstanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
