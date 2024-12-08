import {Component, inject} from '@angular/core';
import {Router} from '@angular/router'
import {AdminServiceService} from '../admin-service.service';

@Component({
  selector: 'app-admin-user-page',
  standalone: true,
  imports: [],
  templateUrl: './admin-user-page.component.html',
  styleUrl: './admin-user-page.component.css'
})
export class AdminUserPageComponent {

  private readonly adminService = inject(AdminServiceService);

  constructor(private route : Router) {

  }

  ngOnInit() {

  }



}
