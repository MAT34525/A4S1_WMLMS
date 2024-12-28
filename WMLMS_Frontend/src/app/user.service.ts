import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);


  searchTracks(query: string): Observable<any[]> {
    console.log(`Search tracks using SQL: ${query}`);
    return this.httpClient.post<any[]>('/user/query', { query });
  }

  // Search artists using SQL query
  searchArtists(query: string): Observable<any[]> {
    console.log(`Search artists using SQL: ${query}`);
    return this.httpClient.post<any[]>('/user/query', { query });
  }
}
