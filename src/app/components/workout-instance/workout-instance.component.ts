import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { 
  DocumentData, 
  Query, 
  collection, 
  getDocs, 
  limit, 
  orderBy, 
  query
} from 'firebase/firestore';

import { Workout } from '../../workout.interface';
import { AerobicFieldsComponent } from '../aerobic-fields/aerobic-fields.component';
import { AnaerobicFieldsComponent } from '../anaerobic-fields/anaerobic-fields.component';

//contains an individual workout instance for a given workout partner.
@Component({
  selector: 'app-workout-instance',
  standalone: true,
  imports: [
    AerobicFieldsComponent,
    AnaerobicFieldsComponent
  ],
  templateUrl: './workout-instance.component.html',
  styleUrl: './workout-instance.component.scss'
})
export class WorkoutInstanceComponent {
  @Input() userPath!: string;
  @Input() workout!: Workout;
  @Input() user!: string;
  @Output() addInstanceData = new EventEmitter<Workout>();

  db: Firestore = inject(Firestore);
  //TODO: figure out enum in angular template
  //error, loading, loaded, empty respectively

  instanceData: DocumentData = {};
  instanceId: string = "";
  currentState: string = "loading";
  
  async ngOnInit() {
    const instancePath = `${this.userPath}/${this.user}/Instances`;
    const instanceCollection = collection(this.db, instancePath);
    const mostRecentInstance = query(instanceCollection,
      orderBy("date", "desc"),
      limit(1)
    )
    this.loadInstance(mostRecentInstance);
  }

  async loadInstance(mostRecentInstance: Query<DocumentData, DocumentData>) {
    const instanceSnapshot = await getDocs(mostRecentInstance);
    if (!instanceSnapshot.empty) {
      instanceSnapshot.forEach((doc) => {
        if (doc.exists()) {
          this.instanceData = doc.data();
          this.instanceId = doc.id;
          this.applyInstanceToUser(this.workout, this.instanceData, this.user);
          // this.addInstanceData.emit(this.workout); //guess i don't need this?
        }
      })
    }
    this.currentState = 'loaded';
  }

  applyInstanceToUser(workout: Workout, instanceData: DocumentData, user: string) {
    switch(user) {
      case 'Ian':
        workout.ianData = instanceData;
        console.log('loading instance data to ian')
        break;
      case 'Holly':
        workout.hollyData = instanceData;
        console.log('loading instance data to holly')
        break;
      default:
        console.error('Could not determine appropriate user!');
    }
  }
}
