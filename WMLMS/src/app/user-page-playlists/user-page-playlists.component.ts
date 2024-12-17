import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UserPageNavbarComponent} from '../user-page-navbar/user-page-navbar.component';

@Component({
  selector: 'app-user-page-playlists',
  imports: [
    RouterOutlet,
    UserPageNavbarComponent
  ],
  templateUrl: './user-page-playlists.component.html',
  standalone: true,
  styleUrl: './user-page-playlists.component.css'
})
export class UserPagePlaylistsComponent {

}
