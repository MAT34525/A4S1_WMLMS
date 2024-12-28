import { Component } from '@angular/core';
import { TrackService, Track } from '../track.service';  // Import TrackService
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-queries-page',
  templateUrl: './user-queries-page.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  styleUrls: ['./user-queries-page.component.css']
})
export class UserQueriesPageComponent {
  query: string = '';  // The search query
  searchResults: Track[] = [];  // Store the search results
  searchType: 'tracks' | 'artists' = 'tracks';  // Toggle between tracks and artists
  errorMessage: string | null = null;
  selectedTrackId: string | null = null;  // Store selected track ID for the Spotify player

  constructor(private trackService: TrackService) {}

  /**
   * Perform search based on query and selected search type (tracks or artists)
   */
  performSearch(): void {
    if (!this.query) {
      this.errorMessage = 'Please enter a search query';
      return;
    }

    let sqlQuery = '';
    if (this.searchType === 'tracks') {
      // SQL query for tracks
      sqlQuery = `SELECT TRACK_ID FROM TRACKS WHERE NAME LIKE '%${this.query}%'`;
    } else if (this.searchType === 'artists') {
      // SQL query for artists
      sqlQuery = `SELECT ARTIST_ID FROM ARTISTS WHERE NAME LIKE '%${this.query}%'`;
    }

    this.trackService.searchTracks(sqlQuery).subscribe({
      next: results => {
        this.searchResults = results;
        this.errorMessage = null;
      },
      error: (err: any) => {
        console.error('Error fetching tracks:', err);
        this.errorMessage = 'Failed to fetch tracks. Please try again later.';
      }
    });
  }

  /**
   * Set the selected track ID to show the Spotify player
   */
  playTrack(trackId: string): void {
    this.selectedTrackId = trackId;
  }
}
