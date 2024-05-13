import { 
  Component, 
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { FirestoreService } from '../firestore.service';
import { AuthService } from '../auth.service';
import { Workout } from '../workout.interface';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    AddWorkoutPanelComponent,
    WorkoutPanelComponent
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  dbService: FirestoreService = inject(FirestoreService);
  authService: AuthService = inject(AuthService);

  isExistingTemplate!: boolean;
  loaded: boolean;
  templateId;
  templateName;
  workoutPath: string = "";

  //want to update this. least privileged. hand stuff off and then move on
  //hell maybe go back to Observable for this
  workouts$: Workout[] = [];

  @ViewChildren(WorkoutPanelComponent) workoutComponents!: QueryList<WorkoutPanelComponent>;

  constructor(private _snackBar: MatSnackBar) { 
    this.isExistingTemplate = history.state.isExistingTemplate;
    this.loaded = false;
    this.templateName = history.state.templateName;
    this.templateId = history.state.templateId;
    this.workoutPath = `WorkoutTemplates/${this.templateId}/Workouts`;
    //TODO: throw error and redirect to error page if templateId isn't there.
  }

  //TODO: re-engineer this. even with isExistingTemplate, this feels a little hacky
  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.loginRedirect();
    }

    if (!this.isExistingTemplate) {
      await this.dbService.createWorkoutTemplate(this.templateId, this.templateName)
      .then(() => {
        this.loaded = true;
      });
    } else {
      await this.dbService.loadWorkoutTemplate(this.workoutPath)
      .then((docs) => {
        this.workouts$ = docs;
        this.loaded = true;
      })
    }
  }

  addWorkout(workout: Workout) {
    this.workouts$.push(workout);
  }

  async finishWorkout() {
    const instanceData = this.fetchInstanceData();
    if (instanceData && instanceData.size > 0) {
      await this.dbService.saveFinishedWorkoutTemplate(this.templateName, instanceData)
      .then(() => {
        this.openSnackBar(`${this.templateName} complete!`, "OK");
      });
    } else if (instanceData && instanceData.size === 0) {
      this.openSnackBar("Error: No workouts performed. Have you hit 'Done'?", "OK");
    } else {
      this.openSnackBar("Error: something went wrong. Bug Ian", "OK");
    }
  }

  fetchInstanceData() {
    let instanceData = new Map<string, DocumentData>();
    for (let i = 0; i < this.workoutComponents.length; i++) {
      const workoutComponent = this.workoutComponents.get(i);
      if (!workoutComponent) {
        console.error("Error: something went wrong fetching data from component");
        return;
      }
      const data = workoutComponent.getInstanceData();
      for (const [key, val] of data) {  
        instanceData.set(key, val);
      }
    }
    return instanceData;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
