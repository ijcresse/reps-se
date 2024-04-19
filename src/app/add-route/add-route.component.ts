import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection } from '@angular/fire/firestore';
import { doc, getDocs, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { WorkoutPanelComponent } from '../components/workout-panel/workout-panel.component';
import { Workout } from '../workout.interface';
import { Util } from '../util';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    CommonModule,
    AddWorkoutPanelComponent,
    WorkoutPanelComponent
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  db: Firestore = inject(Firestore);
  isExistingTemplate!: boolean;
  templateDoc;
  templateName;
  workoutPath: string = "";
  
  //will be inserting into these arrays
  // workouts$: DocumentData[] = [];
  //each will have visible: boolean.
  //updated by workout-panel (lazy loading)
  //when we finally hit save, we iterate over this + get paths
  // workoutInstances$: DocumentData[] = [];

  workouts$: Workout[] = [];

  constructor() { 
    this.isExistingTemplate = history.state.isExistingTemplate;
    if (this.isExistingTemplate) {
      this.templateDoc = history.state.templateDoc;
      this.templateName = this.templateDoc.displayName;
    } else {
      this.templateName = history.state.templateName;
    }
    //throw error and redirect to error page if templateId isn't there.
  }

  //TODO: re-engineer this. even with isExistingTemplate, this feels a little hacky
  async ngOnInit() {
    if (!this.isExistingTemplate) {
      this.createNewTemplate();
    } else {
      this.workoutPath = `WorkoutTemplates/${this.templateDoc.id}/Workouts`;
      const workoutCollection = collection(this.db, this.workoutPath);
      const workoutQuery = query(workoutCollection);
      const workoutSnapshot = await getDocs(workoutQuery);
      workoutSnapshot.forEach((doc) => {
        // this.workouts$[doc.id] = {
        //   workoutData: doc.data(),
        //   instanceData: {}
        // }
        this.workouts$.push({
          workoutId: doc.id,
          workoutData: doc.data(),
          instanceData: {}
        })
        console.log(doc.id, doc.data());
      })
      
      // collectionData(workoutCollection, { idField: 'id' })
      //   .forEach((doc) => {
      //     //if this works... i can emit to the add-route component and have it update workouts$ when add-workout-panel launches a new one.
      //     console.log(doc);
      //     // this.workouts$.push(doc);

      //     this.workouts$[] = {
      //       workoutData: doc,
      //       instanceData: {}
      //     }
      //   })
    }
  }

  //performed here because user has committed to a new page
  async createNewTemplate() {
    const templateId: string = Util.pascalCase(this.templateName);
    console.log('transforming', this.templateName, 'to pascalcase:', templateId);
    const templateDocRef = doc(this.db, "WorkoutTemplates", templateId);
    const templateDoc = {
      displayName: this.templateName,
      color: "tbd",
      latestWorkout: serverTimestamp()
    }
    await setDoc(templateDocRef, templateDoc)
      .then(() => {
        this.templateDoc = templateDoc
        this.templateDoc.id = templateId;
        this.workoutPath = `WorkoutTemplates/${templateId}/Workouts`;
      });
  }
}
