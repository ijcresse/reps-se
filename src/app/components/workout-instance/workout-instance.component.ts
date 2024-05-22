import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentData } from 'firebase/firestore';

import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FirestoreService } from '../../firestore.service';

//contains an individual workout instance for a given workout partner.
@Component({
  selector: 'app-workout-instance',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './workout-instance.component.html',
  styleUrl: './workout-instance.component.scss'
})
export class WorkoutInstanceComponent {
  @Input() userPath!: string;
  @Input() workoutType!: number;
  @Input() user!: string;
  @Input() templateColor!: string;
  @Output() panelColorChange: EventEmitter<string> = new EventEmitter<string>();

  panelColor = "not-done";
  
  db: FirestoreService = inject(FirestoreService);
  //TODO: figure out enum in angular template
  //error, loading, loaded, empty respectively
  
  instancePath: string = "";
  instanceId: string = ""; //what is this for?
  currentState: string = "loading";

  fields: any;
  
  async ngOnInit() {
    this.instancePath = `${this.userPath}/${this.user}/Instances`;
    this.fields = new Fields(this.workoutType);

    this.db.getLastWorkoutInstanceForUser(this.instancePath)
    .then((snapshots) => {
      snapshots.forEach((doc) => {
        if (doc.exists()) {
          this.instanceId = doc.id;
          this.fields.setData(doc.data());
        }
      })
    })
    .catch((error) => {
      console.error(error);
      this.currentState = 'error';
    })
    .finally(() => {
      this.currentState = 'loaded';
    })
  }

  getKeys(obj: Object) {
    const fields = Object.keys(obj);
    if (fields.includes('hours')) {
      return [
        'hours', 'minutes', 'distance', 'notes'
      ]
    } else {
      return [
        'sets', 'reps', 'weight', 'notes'
      ]
    }
  }

  updateFields() {
    this.panelColor = this.templateColor;
    this.currentState = 'performed';
    this.panelColorChange.emit(this.templateColor);
  }

  decrement(key: any) {
    this.fields.performance[key]--;
  }

  increment(key: any) {
    this.fields.performance[key]++;
  }

  wasPerformed(): boolean {
    return this.currentState === 'performed';
  }
  
  getData(): DocumentData {
    return this.fields;
  }

  getPath(): string {
    return this.instancePath;
  }
}

//TODO: is this where a converter would be handy?
//TODO: notes field is having some trouble updating with 2 way binding
class Fields {
  performance: AerobicPerformance | AnaerobicPerformance;
  date: any;

  constructor(type: number) {
    if (type === 0) {
      this.performance = {
        hours: 0,
        minutes: 0,
        distance: 0,
        notes: ""
      }
    } else {
      this.performance = {
        sets: 0,
        reps: 0,
        weight: 0,
        notes: ""
      }
    }
  }

  setData(data: DocumentData) {
    this.date = data['date'];
    this.performance = data['performance'];
  }
}

interface AerobicPerformance {
  hours: number;
  minutes: number;
  distance: number;
  notes: string;
}

interface AnaerobicPerformance {
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}