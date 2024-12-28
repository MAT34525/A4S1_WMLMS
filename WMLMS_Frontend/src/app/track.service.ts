import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Tracks} from './schema';

export interface Track {
  TRACK_ID: string;  // Track ID
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private readonly httpClient : HttpClient = inject(HttpClient);

  constructor(private http: HttpClient) {}

  searchTracks(query: string): Observable<[]> {
    console.log("SEARCH TACKS RAN");

    return this.httpClient.post<[]>('u/queries/tracks', { query : query });
  }
}
