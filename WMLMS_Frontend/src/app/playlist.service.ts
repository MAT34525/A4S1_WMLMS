import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Playlists, Tracks} from './schema';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {

  constructor(private http: HttpClient) {}

  // get all playlists
  getPlaylists(): Observable<Playlists[]> {
    return this.http.get<Playlists[]>(`u/playlists`);
  }

  // get musics from a playlist
  getTracksForPlaylist(playlistId: string): Observable<Tracks[]> {
    return this.http.get<Tracks[]>(`u/playlists-tracks/${playlistId}`);
  }
}
