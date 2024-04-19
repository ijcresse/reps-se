import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { HistoryDetailsComponent } from '../history-details/history-details.component';

@Component({
  selector: 'app-history-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    HistoryDetailsComponent
  ],
  templateUrl: './history-panel.component.html',
  styleUrl: './history-panel.component.scss'
})
export class HistoryPanelComponent {
  @Input() historyDoc!: any;
}
