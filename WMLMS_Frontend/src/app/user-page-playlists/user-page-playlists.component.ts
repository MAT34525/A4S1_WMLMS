import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../playlist.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-playlists',
  templateUrl: './user-page-playlists.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrls: ['./user-page-playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  loaded : boolean = false;
  playlists: any[] = [];
  selectedPlaylistTracks: any[] = [];
  selectedPlaylistName: string = '';

  constructor(private playlistService: PlaylistService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  // Charger toutes les playlists
  loadPlaylists() {
    this.playlistService.getPlaylists().subscribe({
      next: (data) => {
        this.loaded = false;
        this.playlists = data;
        console.log("Playlist data : ", data);
        this.loaded = true;
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
