import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';

@Component({
  selector: 'app-user-page',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent
  ],
  templateUrl: './user-page.component.html',
  standalone: true,
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

}
