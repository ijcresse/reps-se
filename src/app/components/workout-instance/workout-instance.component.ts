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
import { FirestoreService } from '../../firestore.service';

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
  @Input() panelColor!: string;
  @Input() templateColor!: string;
  @Output() panelColorChange: EventEmitter<string> = new EventEmitter<string>();

  db: FirestoreService = inject(FirestoreService);
  //TODO: figure out enum in angular template
  //error, loading, loaded, empty respectively
  
  instanceId: string = "";
  currentState: string = "loading";
  
  async ngOnInit() {
    const instancePath = `${this.userPath}/${this.user}/Instances`;
    this.db.getLastWorkoutInstanceForUser(instancePath, this.user)
    .then((snapshots) => {
      snapshots.forEach((doc) => {
        if (doc.exists()) {
          this.instanceId = doc.id;
          this.workout.userPerformance[this.user].instanceData = doc.data();
        }
      })
    })
    .finally(() => {
      this.currentState = 'loaded';
    })
  }

  //bubble up to workout-panel
  onPanelColorChange(color: string) {
    this.panelColorChange.emit(color);
  }
}
