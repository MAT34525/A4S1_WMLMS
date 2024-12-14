import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Albums, ForumPosts, ForumReplies, Playlists, Users} from './schema';


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
    return this.httpClient.get<Users[]>('/s/admin/users');
  }

  // Get request for a specific Users using IDs
  getUser(users_id : string) : Observable<Users>
  {
    console.log("Admin Service Get : Users By ID");
    return this.httpClient.get<Users>(`/s/admin/users/${users_id}`);
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

  getForumsReplies() : Observable<ForumReplies[]>
  {
    console.log("Admin Service Get : Forums Replies List");
    return this.httpClient.get<ForumReplies[]>(`/s/admin/forums-replies`);
  }

  getForumsPosts() : Observable<ForumPosts[]>
  {
    console.log("Admin Service Get : Forums Posts  List");
    return this.httpClient.get<ForumPosts[]>(`/s/admin/forums-posts`);
  }

  // PUT ==========================================================================================

  // Put request for a specific Users using ID and body
  putUser(users_id : string, user: Users) : Observable<Users>
  {
    console.log("Admin Service Put : User By ID");
    return this.httpClient.put<Users>(`/s/admin/users/${users_id}`, user);
  }
}

