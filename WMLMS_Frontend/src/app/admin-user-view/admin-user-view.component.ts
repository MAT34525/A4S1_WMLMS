// Angular
import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

// Project
import {AdminService} from '../admin-service.service';
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

  private readonly adminService : AdminService = inject(AdminService);

  // User attributes
  user_id : string ='';
  userItem : Users | undefined;

  constructor(private activatedRoute: ActivatedRoute) {
    this.user_id = activatedRoute.snapshot.params['id'];
  }

  // Prepare loaded user values at init
  ngOnInit() {
    this.getUser(this.user_id);
  }

  // Prepare loaded user values at init
  getUser(userID : string)  {

    this.adminService.getUser(userID).subscribe({
      next: data => {
        this.userItem = data;
      }, error:err=> {
        console.log("Failed to load User : ", err);
      }
    });
  }
}
