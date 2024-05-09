import { 
  Component, 
  inject,
  AfterViewInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { DocumentData, DocumentReference, doc, getDocs, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { FirestoreService } from '../firestore.service';
import { Workout, HistoryInstance } from '../workout.interface';
import { Util } from '../util';

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
    const workoutData = this.fetchWorkoutData();
    if (workoutData.length > 0) {
      await this.dbService.saveFinishedWorkout(workoutData)
      .then(() => {
        this.openSnackBar(`${this.templateName} complete`, "OK");
      });
    } else {
      this.openSnackBar("Error: No workouts performed. Have you hit 'Done'?", "OK");
    }
  }

  fetchWorkoutData() {
    let workoutData = [];
    for (let i = 0; i < this.workoutComponents.length; i++) {
      const workoutComponent = this.workoutComponents.get(i);
      if (workoutComponent) {
        const data = workoutComponent.getWorkoutData();
        if (data.instanceData.size > 0) {
          workoutData.push(data);
        }
      }
    }
    return workoutData;
  }

  //assembles information from each workout and creates historyDocs at the same time
  // createDocs(
  //     workoutInstances: Map<DocumentReference, DocumentData>, 
  //     workouts:  DocumentReference[],
  //     historyDocs: DocumentData[]
  // ) {
  //   this.workouts$.forEach((workout) => {
  //     let didWorkout = false;
  //     Object.keys(workout.userPerformance).forEach((user) => {
  //       if (workout.userPerformance[user].performed) {
  //         didWorkout = true;

  //         const instancePath = `${this.workoutPath}/${workout.workoutId}/Users/${user}/Instances`
  //         const instanceRef = this.dbService.getRefFromCollectionPath(instancePath);
  //         workoutInstances.set(instanceRef, workout.userPerformance[user].instanceData);

  //         historyDocs.push({
  //           user: user,
  //           instanceRef:`${instancePath}/${instanceRef.id}`,
  //           workoutName: workout.workoutData['displayName']
  //         })
  //       }
  //     })

  //     if (didWorkout) {
  //       const workoutRef = this.dbService.getRefFromDocPath(`${this.workoutPath}/${workout.workoutId}`);
  //       workouts.push(workoutRef);
  //     }
  //   })
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
