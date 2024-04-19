import { Component, Input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AnaerobicData } from '../../workout.interface';
import { DocumentData, serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-anaerobic-fields',
  standalone: true,
  imports: [
    MatDividerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './anaerobic-fields.component.html',
  styleUrl: './anaerobic-fields.component.scss'
})
export class AnaerobicFieldsComponent {
  @Input() anaerobicData!: AnaerobicData | DocumentData;

  ngOnInit() {
    if (!Object.hasOwn(this.anaerobicData, 'performance')) {
      this.anaerobicData = {
        date: serverTimestamp(),
        performance: {
          sets: 0,
          reps: 0,
          weight: 0
        }
      }
    }
  }
}
