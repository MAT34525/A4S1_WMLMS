import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // get all playlists
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`);
  }

  // get musics from a playlist
  getTracksForPlaylist(playlistId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists/${playlistId}/tracks`);
  }
}
