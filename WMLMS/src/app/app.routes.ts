import { Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AdminPageComponent} from './admin-page/admin-page.component';

export const routes: Routes = [
  {
    path:"login",
    component:LoginPageComponent
  },
  {
    path:"",
    component:MainPageComponent
  },
  {
    path:"a",
    component:AdminPageComponent
  }
];
