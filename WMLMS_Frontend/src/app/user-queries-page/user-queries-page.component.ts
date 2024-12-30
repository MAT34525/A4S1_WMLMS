import {Component, Pipe, PipeTransform} from '@angular/core';
import { TrackService} from '../track.service';  // Import TrackService
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {Artists, Tracks} from '../schema';
import { DomSanitizer} from '@angular/platform-browser';
import {MatChip} from '@angular/material/chips';

@Pipe({standalone: true, name: 'safe'})
export class SafePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(url : string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@Component({
  selector: 'app-user-queries-page',
  templateUrl: './user-queries-page.component.html',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, SafePipe, MatChip],
  styleUrls: ['./user-queries-page.component.css']
})
export class UserQueriesPageComponent {
  protected songURL : string = '';
  query: string = '';  // The search query
  trackSearchResults: Tracks[] = [];  // Store the search results
  artistSearchResults: Artists[] = [];
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

    let sqlQuery = this.query;

    if (this.searchType === 'tracks') {

      this.trackService.searchTracks(sqlQuery).subscribe({
        next: results => {
          console.log(results)
          this.trackSearchResults = results;
          this.errorMessage = null;
        },
        error: (err: any) => {
          console.error('Error fetching tracks:', err);
          this.errorMessage = 'Failed to fetch tracks. Please try again later.';
        }
      });

    } else if (this.searchType === 'artists') {

      this.trackService.searchArtists(sqlQuery).subscribe({
        next: results => {
          this.artistSearchResults = results;
          this.errorMessage = null;
        },
        error: (err: any) => {
          console.error('Error fetching artists:', err);
          this.errorMessage = 'Failed to fetch artists. Please try again later.';
        }
      });
    }
  }

  /**
   * Set the selected track ID to show the Spotify player
   */
  playTrack(trackId: string): void {
    this.selectedTrackId = trackId;
    this.songURL = 'https://open.spotify.com/embed/track/' + this.selectedTrackId + '?utm_source=generator&theme=0'
  }

}
