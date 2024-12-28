import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);


  searchTracks(query: string): Observable<any[]> {
    console.log(`Search songs using : ${query}`);
    return this.httpClient.get<any[]>(`/s/user/search-tracks?query=${encodeURIComponent(query)}`);
  }

  searchArtists(query: string): Observable<any[]> {
    console.log(`Search artists using : ${query}`);
    return this.httpClient.get<any[]>(`/s/user/search-artists?query=${encodeURIComponent(query)}`);
  }
}
