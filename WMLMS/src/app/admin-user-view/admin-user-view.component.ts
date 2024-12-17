import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AdminServiceService} from '../admin-service.service';
import {NgIf} from '@angular/common';
import {Users} from '../schema';

@Component({
  selector: 'app-admin-user-view',
  imports: [
    MatButton,
    NgIf,
    RouterLink
  ],
  templateUrl: './admin-user-view.component.html',
  standalone: true,
  styleUrl: './admin-user-view.component.css'
})
export class AdminUserViewComponent {

  user_id : string ='';
  userItem : Users | undefined;
  adminService=inject(AdminServiceService);

  constructor(private activatedRoute: ActivatedRoute) {

    this.user_id = activatedRoute.snapshot.params['id'];
    this.userItem = undefined;
  }

  ngOnInit() {
    this.getUser(this.user_id);
  }

  getUser(userID : string)  {

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
