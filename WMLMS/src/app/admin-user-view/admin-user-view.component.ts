import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {user} from '../admin-service.service';
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-user-view',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './admin-user-view.component.html',
  styleUrl: './admin-user-view.component.css'
})
export class AdminUserViewComponent {

  user_id : number | undefined;

  userItem : user | undefined;

  adminService : AdminServiceService = inject(AdminServiceService)

  constructor(private activatedRoute: ActivatedRoute, private route : Router) {

    activatedRoute.params.subscribe(id => this.user_id = id['id']);

    this.getUser();
  }

  // Get the user data from the backend
  getUser() {
    if(this.user_id) {
      this.adminService.getUser(this.user_id).subscribe(user => this.userItem = user);
    }
  }

}
