import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './user-page-playlists.component.html',
  styleUrls: ['./user-page-playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  playlists: any[] = [];
  selectedPlaylistTracks: any[] = [];
  selectedPlaylistName: string = '';

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  // Charger toutes les playlists
  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
      },
      error: (err) => {
        console.error('Error fetching playlists:', err);
      }
    });
  }

  // Charger les musiques d'une playlist
  loadTracks(playlistId: string, playlistName: string): void {
    this.selectedPlaylistName = playlistName;
    this.playlistService.getTracksForPlaylist(playlistId).subscribe({
      next: (data) => {
        this.selectedPlaylistTracks = data;
      },
      error: (err) => {
        console.error('Error fetching tracks for playlist:', err);
      }
    });
  }
}
