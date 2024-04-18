import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-panel',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './add-panel.component.html',
  styleUrl: './add-panel.component.scss'
})
export class AddPanelComponent {
  panelOpenState: boolean = false;

}
