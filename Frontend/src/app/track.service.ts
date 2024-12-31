import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Artists, Tracks} from './schema';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private readonly httpClient : HttpClient = inject(HttpClient);

  constructor() {}

  searchTracks(query: string): Observable<Tracks[]> {
    console.log("User Service Get : Track Search");
    return this.httpClient.post<Tracks[]>('u/queries/tracks', { query : query });
  }

  searchArtists(query: string): Observable<Artists[]> {
    console.log("User Service Get : Artist Search");
    return this.httpClient.post<Artists[]>('u/queries/artists', { query : query });
  }
}
