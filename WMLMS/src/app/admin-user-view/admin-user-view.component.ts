import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {User} from '../admin-service.service';
import {AdminServiceService} from '../admin-service.service';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-admin-user-view',
    imports: [
        MatButton,
        NgIf,
        RouterLink
    ],
    templateUrl: './admin-user-view.component.html',
    styleUrl: './admin-user-view.component.css'
})
export class AdminUserViewComponent {

  user_id : number = 0;
  userItem : User | undefined;
  adminService=inject(AdminServiceService);

  constructor(private activatedRoute: ActivatedRoute) {

    this.user_id = +activatedRoute.snapshot.params['id'];
    this.userItem = undefined;
  }

  ngOnInit() {
    this.getUser(this.user_id);
  }

  getUser(userID : number)  {

    if(!Number.isNaN(userID)) {
      this.adminService.getUser(userID).subscribe({
        next: data => {
          this.userItem = data;
          console.log('GET /admin/user/:id', data);
        }, error:err=> {
          console.log("Failed to load User");
        }
      });
    }
    else {
      console.warn("User ID was not numeric !");
    }
  }

}
