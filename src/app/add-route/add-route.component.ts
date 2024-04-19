import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData, DocumentReference } from '@angular/fire/firestore';
import { DocumentData, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';

import { AddWorkoutPanelComponent } from '../components/add-workout-panel/add-workout-panel.component';
import { Util } from '../util';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [
    AddWorkoutPanelComponent
  ],
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss'
})
export class AddRouteComponent {
  db: Firestore = inject(Firestore);
  isExistingTemplate!: boolean;
  templateDoc;
  templateName;
  // workouts$: Observable<any[]> = of();
  workouts$: DocumentData[] = [];

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
      const templateId = this.templateDoc.id;
      const workoutCollection = collection(this.db, "WorkoutTemplates", templateId, "Workouts");

      // this.workouts$ = collectionData(workoutCollection);
      collectionData(workoutCollection)
        .forEach((doc) => {
          //if this works... i can emit to the add-route component and have it update workouts$ when add-workout-panel launches a new one.
          this.workouts$.push(doc);
        })
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
      });
  }
}
