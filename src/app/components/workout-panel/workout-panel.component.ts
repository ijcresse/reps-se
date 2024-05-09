import { 
  Component, 
  Input,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';

import { WorkoutInstanceComponent } from '../workout-instance/workout-instance.component';
import { DocumentData } from 'firebase/firestore';

//simple containing expansionpanel for individual workout instances within.
@Component({
  selector: 'app-workout-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    WorkoutInstanceComponent
  ],
  templateUrl: './workout-panel.component.html',
  styleUrl: './workout-panel.component.scss'
})
export class WorkoutPanelComponent {
  @Input() workoutId!: string;
  @Input() workoutName!: string;
  @Input() workoutPath!: string;
  @Input() workoutType!: number;
  @Input() templateColor!: string;
  @Input() index!: number;

  @ViewChildren(WorkoutInstanceComponent) instanceComponents?: QueryList<WorkoutInstanceComponent>;

  //initially empty - workouts don't get color until they're performed.
  panelColor: string = "";

  //TODO: dont like this too much but i can refactor this with the stringbuilder stuff later
  userPath: string = "";

  ngOnInit() {
    this.userPath = `${this.workoutPath}/Users`;
  }

  //fetches data from add route
  getInstanceData(): Map<string, DocumentData> {
    let instanceData: Map<string, DocumentData> = new Map();

    if (this.instanceComponents) {
      for (let i = 0; i < this.instanceComponents.length; i++) {
        const instance = this.instanceComponents.get(i);
        if (instance && instance.wasPerformed()) {
          instanceData.set(instance.getPath(), instance.getData());
        }
      }
    }
    return instanceData;
  }
}