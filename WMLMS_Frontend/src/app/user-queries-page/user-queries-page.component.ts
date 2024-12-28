import { Component } from '@angular/core';
import { UserService } from '../user.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-user-queries-page',
  templateUrl: './user-queries-page.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  styleUrls: ['./user-queries-page.component.css']
})
export class UserQueriesPageComponent {
  query: string = '';
  searchResults: any[] = []; // Stores API results
  searchType: 'tracks' | 'artists' = 'tracks'; // Tracks or Artists selection
  errorMessage: string | null = null; // Error message if the query fails

  constructor(private userService: UserService) {}

  // Search based on the selected type
  performSearch(): void {
    // Define SQL queries based on searchType
    let sqlQuery = '';

    if (this.searchType === 'tracks') {
      sqlQuery = `SELECT NAME FROM TRACKS WHERE NAME LIKE '%${this.query}%'`;
    } else if (this.searchType === 'artists') {
      sqlQuery = `SELECT NAME FROM ARTISTS WHERE NAME LIKE '%${this.query}%'`;
    }

    // Execute SQL query
    if (this.searchType === 'tracks') {
      this.userService.searchTracks(sqlQuery).subscribe({
        next: (results: any[]) => {
          this.searchResults = results;
          this.errorMessage = null;
        },
        error: (err: any) => {
          console.error('Error fetching tracks:', err);
          this.errorMessage = 'Failed to fetch tracks. Please try again later.';
        }
      });
    } else {
      this.userService.searchArtists(sqlQuery).subscribe({
        next: (results: any[]) => {
          this.searchResults = results;
          this.errorMessage = null;
        },
        error: (err: any) => {
          console.error('Error fetching artists:', err);
          this.errorMessage = 'Failed to fetch artists. Please try again later.';
        }
      });
    }
  }
}
