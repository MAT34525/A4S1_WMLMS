import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private readonly apiUrl = 'http://localhost:3000'; // URL de votre backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les playlists
  getPlaylists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists`);
  }

  // Récupérer les musiques d'une playlist
  getTracksForPlaylist(playlistId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/playlists/${playlistId}/tracks`);
  }
}
