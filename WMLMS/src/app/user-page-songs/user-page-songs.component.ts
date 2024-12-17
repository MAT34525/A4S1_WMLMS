import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';

@Component({
  selector: 'app-user-page-songs',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent
  ],
  templateUrl: './user-page-songs.component.html',
  standalone: true,
  styleUrl: './user-page-songs.component.css'
})
export class UserPageSongsComponent {

}
