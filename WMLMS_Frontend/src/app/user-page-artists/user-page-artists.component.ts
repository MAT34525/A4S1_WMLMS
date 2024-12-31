import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';

@Component({
  selector: 'app-user-page-artists',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent
  ],
  templateUrl: './user-page-artists.component.html',
  standalone: true,
  styleUrl: './user-page-artists.component.css'
})
export class UserPageArtistsComponent {

}
