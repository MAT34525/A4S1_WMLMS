import {Component, inject} from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import {MatButton} from '@angular/material/button';
import {Router} from '@angular/router';
import {AdminServiceService} from '../admin-service.service';
import {AdminUserDeleteDialogComponent} from '../admin-user-delete-dialog/admin-user-delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import { firstValueFrom} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatCheckbox} from '@angular/material/checkbox';
import {Users} from '../schema';

// Based on the following tutorial : https://www.ag-grid.com/angular-data-grid/components/

@Component({
  standalone: true,
  templateUrl: 'admin-user-page-buttons.component.html',
  imports: [
    MatButton,
    MatSlideToggle,
    FormsModule,
    MatCheckbox
  ],
  styleUrl: 'admin-user-page-buttons.component.css'
})

export class AdminUserPageButtonsComponent implements ICellRendererAngularComp {


  public user_id: string = '';
  is_locked : string = 'N';
  user : Users | undefined = undefined;
  toogleLockValue : string = "Unlocked";
  toogleLockStatus : boolean = false;

  params : ICellRendererParams | undefined;

  adminService = inject(AdminServiceService);

  constructor(public dialog: MatDialog, private route : Router) {}

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.user_id = params.data.USER_ID;

    this.adminService.getUser(this.user_id).subscribe(data =>
      {
        console.log('User loaded : ', data);
        this.user = data;
      }
    );

    this.is_locked = params.data.IS_LOCKED;

    this.updateLock();
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  updateLock() {
    if(this.is_locked === 'Y') {
      this.toogleLockValue = "Locked";
      this.toogleLockStatus = true;
    } else {
      this.toogleLockValue = "Unlocked";
      this.toogleLockStatus = false;
    }
  }

  onToogleLockClick()
  {
    this.is_locked = (this.is_locked === 'N')? "Y": "N" ;

    this.updateLock();

    console.log(this.is_locked)

    console.log("Admin user lock toogle triggered for user : ", this.user_id);

    if(this.user){
      this.adminService.toogleUserLock(this.user_id, this.user)
        .subscribe(users => this.user);
    }
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

}
