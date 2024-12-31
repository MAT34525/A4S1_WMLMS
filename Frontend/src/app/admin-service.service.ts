// Angular
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// Project
import {Albums, Artists, Playlists, Tracks, Users} from './schema';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private readonly httpClient : HttpClient = inject(HttpClient);

  // GET ==========================================================================================

  // Get request for the Users list
  getUsers() : Observable<Users[]>
  {
    console.log("Admin Service Get : Users List");
    return this.httpClient.get<Users[]>('/s/admin/users');
  }

  // Get request for the Artists Count (for progress bar reference) Users list
  getArtistsCount() : Observable<{result : number}>
  {
    console.log("Admin Service Get : Artists Count");
    return this.httpClient.get<{result : number}>('/s/admin/count/artists');
  }

  // Get request for a specific Users using IDs
  getUser(users_id : string) : Observable<Users>
  {
    console.log("Admin Service Get : Users By ID");
    return this.httpClient.get<Users>(`/s/admin/users/${users_id}`);
  }

  // Get request for a specific Artist using IDs
  getArtist(artist_id : string) : Observable<Artists>
  {
    console.log("Admin Service Get : Users By ID");
    return this.httpClient.get<Artists>(`/s/admin/artists/${artist_id}`);
  }

  getAlbums() : Observable<Albums[]>
  {
    console.log("Admin Service Get : Albums List");
    return this.httpClient.get<Albums[]>(`/s/admin/albums`);
  }

  getPlaylists() : Observable<Playlists[]>
  {
    console.log("Admin Service Get : Playlists List");
    return this.httpClient.get<Playlists[]>(`/s/admin/playlists`);
  }

  getTracks() : Observable<Tracks[]>
  {
    console.log("Admin Service Get : Tracks List");
    return this.httpClient.get<Tracks[]>(`/s/admin/tracks`);
  }

  getArtistsTopTen() : Observable<{NAME : string, FOLLOWERS : number}[]>
  {
    console.log("Admin Service Get : Artists Top Ten");
    return this.httpClient.get<{NAME : string, FOLLOWERS : number}[]>(`/s/admin/statistics/artists`);
  }

  getTracksExplicitCount() : Observable<{EXPLICIT : number, COUNT : number}[]>
  {
    console.log("Admin Service Get : Tracks Explicit Count");
    return this.httpClient.get<{EXPLICIT : number, COUNT : number}[]>(`/s/admin/statistics/explicit`);
  }

  // PUT ==========================================================================================

  // Put request for a specific Users using ID and body
  putUser(users_id : string, user: Users) : Observable<Users>
  {
    console.log("Admin Service Put : User By ID");
    return this.httpClient.put<Users>(`/s/admin/users/${users_id}`, user);
  }

  // Put request for a specific Users using ID and body
  toggleUserLock(users_id : string, user : Users) : Observable<Users>
  {
    console.log("Admin Service Put : User Lock By ID", user);
    return this.httpClient.put<Users>(`/s/admin/users/lock/${users_id}`, user);
  }

  // Put request for a specific Users using ID and body
  toggleArtistVerification(artist_id : string, artist : Artists) : Observable<Artists>
  {
    console.log("Admin Service Put : Artist Verifiaction By ID", artist);
    return this.httpClient.put<Artists>(`/s/admin/artists/verification/${artist_id}`, artist);
  }

  // DELETE =======================================================================================

  deleteUser(users_id : string) : Observable<Users>
  {
    console.log("Admin Service DELETE : User By ID");
    return this.httpClient.delete<Users>(`/s/admin/users/${users_id}`)
  }

  // POST =========================================================================================

  customQuery(query : string) : Observable<[]>
  {
    console.log("Admin Service POST : Custom Query");
    return this.httpClient.post<[]>(`/s/admin/query`, {
      query : query
    });
  }

  customCount(query : string) : Observable<number>
  {
    console.log("Admin Service POST : Custom Count");
    return this.httpClient.post<number>(`/s/admin/query-count`, {
      table : query
    });
  }

  // Post request for the Artist list depending on the requested page and the page size
  getArtists(pageNumber : number, pageSize : number) : Observable<Artists[]>
  {
    console.log("Admin Service Get : Artists List");
    return this.httpClient.post<Artists[]>('/s/admin/artists/delayed', {page : pageNumber , size : pageSize});
  }
}

