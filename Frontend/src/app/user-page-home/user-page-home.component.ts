import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';

@Component({
  selector: 'app-user-page-home',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent,
  ],
  templateUrl: './user-page-home.component.html',
  standalone: true,
  styleUrl: './user-page-home.component.css'
})
export class UserPageHomeComponent {

}
