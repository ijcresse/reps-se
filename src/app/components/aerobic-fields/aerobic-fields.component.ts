import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DocumentData, serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-aerobic-fields',
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
  templateUrl: './aerobic-fields.component.html',
  styleUrl: './aerobic-fields.component.scss'
})
export class AerobicFieldsComponent {
  @Input() aerobicData!: DocumentData;
  @Input() user!: string;
  @Input() templateColor!: string;
  @Input() workoutPanelColor!: string;
  @Output() workoutPanelColorChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() aerobicDataChange:EventEmitter<DocumentData> = new EventEmitter<DocumentData>();

  panelColor: string = "not-done";

  ngOnInit() {
    if (!Object.hasOwn(this.aerobicData['instanceData'], 'performance')) {
      this.aerobicData['instanceData'] = {
        date: serverTimestamp(),
        performance: {
          hours: 0,
          minutes: 0,
          miles: 0,
          notes: ""
        }
      }
    }
  }

  updateFields() {
    this.aerobicData['performed'] = true;
    this.panelColor = this.templateColor;
    this.workoutPanelColorChange.emit(this.templateColor);
    this.aerobicDataChange.emit(this.aerobicData);
  }

}
