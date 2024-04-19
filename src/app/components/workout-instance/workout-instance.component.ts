import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { CollectionReference, DocumentData, Query, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { Workout } from '../../workout.interface';

//contains an individual workout instance for a given workout partner.
@Component({
  selector: 'app-workout-instance',
  standalone: true,
  imports: [],
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
    console.log('workout-instance path:', instancePath);
    const instanceCollection = collection(this.db, instancePath);
    const mostRecentInstance = query(instanceCollection,
      orderBy("date", "desc"),
      limit(1)
    )
  }

  async loadInstance(instancePath: string, 
                     instanceCollection: CollectionReference, 
                     mostRecentInstance: Query<DocumentData, DocumentData>) {
    const instanceSnapshot = await getDocs(mostRecentInstance);
    if (instanceSnapshot.empty) {
      this.currentState = 'empty';
      return;
    }
    instanceSnapshot.forEach((doc) => {
      if (doc.exists()) {
        this.instanceData = doc.data();
        this.instanceId = doc.id;
        this.saveInstanceToUser(this.workout, this.instanceData, this.user);
        // this.addInstanceData.emit(this.workout); //guess i don't need this?
        this.currentState = 'loaded';
      }
    })
  }

  saveInstanceToUser(workout: Workout, instanceData: DocumentData, user: string) {
    switch(user) {
      case 'Ian':
        workout.ianData = instanceData;
        break;
      case 'Holly':
        workout.hollyData = instanceData;
        break;
      default:
        console.error('Could not determine appropriate user!');
    }
  }
}
