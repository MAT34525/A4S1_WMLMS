import {Component, inject} from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AdminServiceService} from '../admin-service.service';

// Based on the following tutorial : https://www.ag-grid.com/angular-data-grid/components/

@Component({
  standalone: true,
  templateUrl: 'admin-user-page-buttons.component.html',
  imports: [
    MatButton
  ],
  styleUrl: 'admin-user-page-buttons.component.css'
})

export class AdminUserPageButtonsComponent implements ICellRendererAngularComp {
  public user_id: string = '';

  params : ICellRendererParams | undefined;

  private readonly adminService = inject(AdminServiceService);

  constructor(private route : Router) {}

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.user_id = params.data.USER_ID;
  }

  refresh(params: ICellRendererParams) {
    return false;
  }

  onDeleteClick()
  {
    console.log("Admin user delete triggered for user : ", this.user_id);
  }

  onViewClick()
  {
    console.log("Admin user view triggered for user : ", this.user_id);
    this.route.navigate(['/a/users/view', this.user_id]);
  }

  onEditClick()
  {
    console.log("Admin user edit triggered for user : ", this.user_id);
    this.route.navigate(['/a/users/edit', this.user_id]);
  }

  buttonClicked() {
    console.log(this.user_id);
  }
}
