import { Component } from '@angular/core';
import { UserService } from '../user.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-queries-page',
  templateUrl: './user-queries-page.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./user-queries-page.component.css']
})
export class UserQueriesPageComponent {
  query: string = ''; // Input for search queries
  searchResults: any[] = []; // Stores API results
  searchType: 'tracks' | 'artists' = 'tracks'; // Tracks or Artists selection

  constructor(private userService: UserService) {}

  // Perform the search based on the selected type
  performSearch(): void {
    if (this.searchType === 'tracks') {
      this.userService.searchTracks(this.query).subscribe({
        next: (results: any[]) => {
          this.searchResults = results;
        },
        error: (err: any) => {
          console.error('Error fetching tracks:', err);
        }
      });
    } else {
      this.userService.searchArtists(this.query).subscribe({
        next: (results: any[]) => {
          this.searchResults = results;
        },
        error: (err: any) => {
          console.error('Error fetching artists:', err);
        }
      });
    }
  }
}
