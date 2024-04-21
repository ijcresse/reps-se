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
  @Input() panelColor!: string;
  @Input() templateColor!: string;
  @Output() panelColorChange: EventEmitter<string> = new EventEmitter<string>();

  db: Firestore = inject(Firestore);
  //TODO: figure out enum in angular template
  //error, loading, loaded, empty respectively
  
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
          this.instanceId = doc.id;
          this.workout.userPerformance[this.user].instanceData = doc.data();
        }
      })
    }
    this.currentState = 'loaded';
  }

  //bubble up to workout-panel
  onPanelColorChange(color: string) {
    this.panelColorChange.emit(color);
  }
}
