import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Track {
  TRACK_ID: string;  // Track ID
}

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private baseUrl = 'http://localhost:3000';  // Backend URL

  constructor(private http: HttpClient) {}

  searchTracks(query: string): Observable<Track[]> {
    console.log("SEARCH TACKS RAN");
    const url = `${this.baseUrl}/searchTracks`;
    return this.http.post<Track[]>(url, { query });
  }
}
