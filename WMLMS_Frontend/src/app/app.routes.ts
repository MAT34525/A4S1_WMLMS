import { Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AdminPageComponent} from './admin-page/admin-page.component';
import {AdminUserPageComponent} from './admin-user-page/admin-user-page.component';
import {AdminTablesPageComponent} from './admin-tables-page/admin-tables-page.component';
import {AdminQueriesPageComponent} from './admin-queries-page/admin-queries-page.component';
import {AdminStatisticsPageComponent} from './admin-statistics-page/admin-statistics-page.component';
import {AdminHomePageComponent} from './admin-home-page/admin-home-page.component';
import {AdminUserViewComponent} from './admin-user-view/admin-user-view.component';
import {AdminUserEditComponent} from './admin-user-edit/admin-user-edit.component';
import {AdminArtistPageComponent} from './admin-artist-page/admin-artist-page.component';
import {SignupPageComponent} from './signup-page/signup-page.component';
import {AdminLoginPageComponent} from './admin-login-page/admin-login-page.component';
import {UserPageComponent} from './user-page/user-page.component';
import {UserPageHomeComponent} from './user-page-home/user-page-home.component';
import {UserPageArtistsComponent} from './user-page-artists/user-page-artists.component';
import {PlaylistsComponent} from './user-page-playlists/user-page-playlists.component';
import {UserPageSongsComponent} from './user-page-songs/user-page-songs.component';
import {UserQueriesPageComponent} from './user-queries-page/user-queries-page.component';


export const routes: Routes = [
  {
    path:"",
    component:MainPageComponent,
  },
  {
    path:"login",
    component:LoginPageComponent
  },
  {
    path:"admin-login",
    component:AdminLoginPageComponent
  },
  {
    path:"signup",
    component:SignupPageComponent
  },
  {
    path: "user",
    component: UserPageComponent,
    children: [
      {
        path:'',
        redirectTo: 'queries',
        pathMatch: 'full',
      },
      {
        path:'home',
        redirectTo: 'queries',
        pathMatch: 'full'
      },
      {
        path:'artists',
        component:UserPageArtistsComponent,
      },
      {
        path:'playlists',
        component:PlaylistsComponent,
      },
      {
        path:'songs',
        component:UserPageSongsComponent,
      },
      {
        path:'queries',
        component:UserQueriesPageComponent,
      }
    ]
  },
  {
    path: "a",
    component: AdminPageComponent,
    children: [
      {
        path:'',
        redirectTo:'home',
        pathMatch: 'full',
      },
      {
        path:'home',
        component:AdminHomePageComponent,
      },
      {
        path:'users',
        component:AdminUserPageComponent,
      },
      {
        path:'users/view',
        redirectTo: 'users'
      },
      {
        path:'users/view/:id',
        component:AdminUserViewComponent,
      },
      {
        path:'users/edit/:id',
        component:AdminUserEditComponent,
      },
      {
        path:'artists',
        component: AdminArtistPageComponent,
      },
      {
        path:'tables',
        component:AdminTablesPageComponent,
      },
      {
        path:'queries',
        component:AdminQueriesPageComponent,
      },
      {
        path:'statistics',
        component:AdminStatisticsPageComponent,
      },
      {
        path: 'login',
        component:AdminLoginPageComponent,
      }
    ]
  },

];
