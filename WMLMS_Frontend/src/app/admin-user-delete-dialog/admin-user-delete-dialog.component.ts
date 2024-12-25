import {Component, inject, Inject, Input} from '@angular/core';
import {MatDialogActions, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-user-delete-dialog',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './admin-user-delete-dialog.component.html',
  standalone: true,
  styleUrl: './admin-user-delete-dialog.component.css'
})
export class AdminUserDeleteDialogComponent {

  adminService=inject(AdminServiceService);



  constructor(public dialogRef: MatDialogRef<AdminUserDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any
  ) {
    console.log("Dialog created for user : ", this.data.user_id)
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
