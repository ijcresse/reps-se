import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { DocumentData, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
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
  @Input() workoutPath!: string;
  @Input() workout!: Workout;
  @Input() user!: string;
  @Output() addInstanceData = new EventEmitter<Workout>();

  db: Firestore = inject(Firestore);
  instanceData: DocumentData = {};
  instanceId: string = "";
  //TODO: figure out enum in angular template
  //error, loading, loaded, empty respectively
  states: number[] = [-1, 0, 1, 2];
  currentState: number = 0;

  async ngOnInit() {
    const instanceCollection = collection(this.db, this.workoutPath);
    const mostRecentInstance = query(instanceCollection, 
      where("user", "==", this.user),
      orderBy("date", "desc"),
      limit(1)
    )
    const instanceSnapshot = await getDocs(mostRecentInstance);
    instanceSnapshot.forEach((doc) => {
      this.instanceData = doc.data();
      this.instanceId = doc.id;
      console.log(this.user, this.instanceData);
      var workoutUpdate = this.workout;
      workoutUpdate.instanceData.push(this.instanceData); //does this update it?
      // this.addInstanceData.emit(workoutUpdate);
    })
    console.log(this.instanceId);
    this.updateState();
  }

  updateState() {
    this.currentState = this.instanceId ? 2 : 3;
  }
}
