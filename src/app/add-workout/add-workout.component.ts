import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [],
  templateUrl: './add-workout.component.html',
  styleUrl: './add-workout.component.scss'
})
export class AddWorkoutComponent {
  db: Firestore = inject(Firestore);
  isNewTemplate!: boolean;
  templateName!: string;

  constructor() { 
    this.isNewTemplate = history.state.isNewTemplate;
    this.templateName = history.state.templateName;

    //throw error and redirect to error page if templateId isn't there.
  }

  ngOnInit() {
    /*
    ifNewTemplate
      templateId = squish down template name into camel casing
    */
  }
}
