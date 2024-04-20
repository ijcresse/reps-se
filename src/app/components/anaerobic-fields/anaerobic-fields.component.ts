import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
  @Input() anaerobicData!: DocumentData;
  @Output() anaerobicDataChange:EventEmitter<DocumentData> = new EventEmitter<DocumentData>();

  ngOnInit() {
    if (!Object.hasOwn(this.anaerobicData['instanceData'], 'performance')) {
      this.anaerobicData['instanceData'] = {
        date: serverTimestamp(),
        performance: {
          sets: 0,
          reps: 0,
          weight: 0
        }
      }
    }
  }

  updateFields() {
    this.anaerobicData['performed'] = true;
    this.anaerobicDataChange.emit(this.anaerobicData);
  }
}
