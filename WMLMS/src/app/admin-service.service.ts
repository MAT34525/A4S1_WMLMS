import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './schema';


@Injectable({
  providedIn: 'root'
})

export class AdminServiceService {


  httpClient = inject(HttpClient);

  constructor() {}

  // Get request for the user list
  getUsers() : Observable<User[]>
  {
    console.log("Admin Service Get : User List");
    return this.httpClient.get<User[]>('/s/admin/user-list');
  }

  // Get request for a specific user using IDs
  getUser(user_id : number) : Observable<User>
  {
    console.log("Admin Service Get : User By ID");
    return this.httpClient.get<User>(`/s/admin/user/${user_id}`);
  }

  getSongs() : Observable<User>
  {
    console.log("Admin Service Get : Songs List");
    return this.httpClient.get<User>(`/s/admin/songs`);
  }

  getPlaylists() : Observable<User>
  {
    console.log("Admin Service Get : Playlists List");
    return this.httpClient.get<User>(`/s/admin/playlists`);
  }
}

