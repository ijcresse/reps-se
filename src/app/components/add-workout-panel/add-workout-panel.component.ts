import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    FormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './add-workout-panel.component.html',
  styleUrl: './add-workout-panel.component.scss'
})
export class AddWorkoutPanelComponent {
  workoutName: string = "";
  activeTab = new FormControl(0);

  //TODO: these should be classes with converters
  foo = 0;
  aerobic = {
    'hours': 0,
    'minutes': 0,
    'notes': ""
  }
  anaerobic = {
    sets: 0,
    reps: 0,
    weight: 0
  }

  addWorkout() {
    if (this.activeTab.value === 0) {
      console.log('aerobic', this.aerobic);
    } else {
      console.log('anaerobic', this.anaerobic);
    }
  }
}
