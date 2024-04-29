import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { query } from 'firebase/firestore';
import { Observable, of } from 'rxjs';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, FormControl } from '@angular/forms';
import { Util } from '../../util';

@Component({
  selector: 'app-add-template-panel',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-template-panel.component.html',
  styleUrl: './add-template-panel.component.scss'
})
export class AddTemplatePanelComponent {
  db: Firestore = inject(Firestore);
  templates$: Observable<any[]> = of();
  activeTab = new FormControl(0);
  loaded: boolean = false;

  selectedTemplate: any;
  createTemplateName: string = ''

  constructor(private router: Router) { }
  
  async panelOpened() {
    if (this.loaded) {
      return;
    }
    const templatesQuery = query(collection(this.db, "WorkoutTemplates"));
    this.templates$ = collectionData(templatesQuery, { idField: 'id' });
    this.loaded = true;
  }

  //perhaps i should have load template vs create template?
  createTemplate() {
    const isExistingTemplate = this.activeTab.value === 0;
    const templateState = { 
      isExistingTemplate: isExistingTemplate,
      templateId: "",
      templateName: ""
    };
    if (isExistingTemplate) {
      templateState.templateId = this.selectedTemplate.id,
      templateState.templateName = this.selectedTemplate.displayName
    } else {
      templateState.templateId = Util.pascalCase(this.createTemplateName);
      templateState.templateName = this.createTemplateName;
    }
    this.router.navigateByUrl(`/add`, { state: templateState });
  }
}
