import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Users} from './schema';


@Injectable({
  providedIn: 'root'
})

export class AdminServiceService {


  httpClient = inject(HttpClient);

  constructor() {}

  // Get request for the Users list
  getUsers() : Observable<Users[]>
  {
    console.log("Admin Service Get : Users List");
    return this.httpClient.get<Users[]>('/s/admin/user-list');
  }

  // Get request for a specific Users using IDs
  getUser(users_id : number) : Observable<Users>
  {
    console.log("Admin Service Get : Users By ID");
    return this.httpClient.get<Users>(`/s/admin/user/${users_id}`);
  }

  getSongs() : Observable<Users>
  {
    console.log("Admin Service Get : Songs List");
    return this.httpClient.get<Users>(`/s/admin/songs`);
  }

  getPlaylists() : Observable<Users>
  {
    console.log("Admin Service Get : Playlists List");
    return this.httpClient.get<Users>(`/s/admin/playlists`);
  }
}

