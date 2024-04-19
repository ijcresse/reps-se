import { Component, Input } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AerobicData } from '../../workout.interface';
import { DocumentData, serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-aerobic-fields',
  standalone: true,
  imports: [
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
  @Input() aerobicData!: AerobicData | DocumentData;

  ngOnInit() {
    if (!Object.hasOwn(this.aerobicData, 'performance')) {
      this.aerobicData = {
        date: serverTimestamp(),
        performance: {
          hours: 0,
          minutes: 0,
          notes: ""
        }
      }
    }
  }

}
