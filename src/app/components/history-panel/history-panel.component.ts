import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

import { DocumentData } from 'firebase/firestore';

import { HistoryDetailsComponent } from '../history-details/history-details.component';
import { Util } from '../../util';

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
  @Input() historyDoc!: DocumentData;
  panelColor: string = "";

  ngOnInit() {
    this.panelColor = Util.pascalCase(this.historyDoc['displayName']);
  }
}
