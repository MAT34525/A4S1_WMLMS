// Angular
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatButton} from '@angular/material/button';

// AG Grid
import type {ICellRendererAngularComp} from 'ag-grid-angular';
import type {ICellRendererParams} from 'ag-grid-community';

// Project
import {AdminService} from '../admin-service.service';
import {Users} from '../schema';

// Based on the following tutorial : https://www.ag-grid.com/angular-data-grid/components/

@Component({
  standalone: true,
  templateUrl: 'admin-user-page-buttons.component.html',
  imports: [
    MatSlideToggle,
    MatButton,
  ],
  styleUrl: 'admin-user-page-buttons.component.css'
})
export class AdminUserPageButtonsComponent implements ICellRendererAngularComp {

  private readonly adminService : AdminService = inject(AdminService);

  // Angular component
  params : ICellRendererParams | undefined;

  // Private elements
  private user_id: string = '';
  private is_locked : string = 'N';
  private user : Users | undefined = undefined;

  // Toggle button
  toggleLockValue : string = "Unlocked";
  toggleLockStatus : boolean = false;

  constructor(private route : Router) {}

  // Prepare values at init
  agInit(params: ICellRendererParams): void {

    this.params = params;

    this.user_id = params.data.USER_ID;
    this.is_locked = params.data.IS_LOCKED;

    // Get additional values for the selected user
    this.adminService.getUser(this.user_id).subscribe(data => this.user = data);

    // Update messages using toggle status
    this.updateLock();
  }

  // Cell refresh
  refresh(params: ICellRendererParams) {
    return true;
  }

  // Toggle values update
  updateLock() {
    if(this.is_locked === 'Y') {
      this.toggleLockValue = "Locked";
      this.toggleLockStatus = true;
    } else {
      this.toggleLockValue = "Unlocked";
      this.toggleLockStatus = false;
    }
  }

  // Actions to run when toggling the locking button
  ontoggleLockClick()
  {
    console.log("Admin user lock toggle triggered for : ", this.user_id);

    // Invert the locking status
    this.is_locked = (this.is_locked === 'N')? "Y": "N" ;

    // Update toggle value
    this.updateLock();

    // Update the new user status in the database
    if(this.user){
      this.adminService.toggleUserLock(this.user_id, this.user)
        .subscribe(users => this.user);
    }
  }

  // View pane for user
  onViewClick()
  {
    console.log("Admin user view triggered for : ", this.user_id);
    this.route.navigate(['/a/users/view', this.user_id]).then();
  }

  // Edit pane for user
  onEditClick()
  {
    console.log("Admin user edit triggered for : ", this.user_id);
    this.route.navigate(['/a/users/edit', this.user_id]).then();
  }
}
