import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { WorkoutInstanceComponent } from '../workout-instance/workout-instance.component';

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    WorkoutInstanceComponent
  ],
  templateUrl: './history-panel.component.html',
  styleUrl: './history-panel.component.scss'
})
export class HistoryPanelComponent {
  @Input() historyDoc!: any;

  instancesFetched: boolean = false;
  panelOpenState: boolean = false;

}
