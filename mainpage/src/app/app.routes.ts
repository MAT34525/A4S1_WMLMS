import { Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {SignupPageComponent} from './signup-page/signup-page.component';
import {MainPageComponent} from './main-page/main-page.component';

export const routes: Routes = [
  {
    path:"login",
    component:LoginPageComponent
  },
  {
    path:"signup",
    component:SignupPageComponent
  },
  {
    path:"",
    component:MainPageComponent
  }
];


