import { Routes } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {MainPageComponent} from './main-page/main-page.component';
import {AdminPageComponent} from './admin-page/admin-page.component';
import {AdminUserPageComponent} from './admin-user-page/admin-user-page.component';
import {AdminTablesPageComponent} from './admin-tables-page/admin-tables-page.component';
import {AdminQueriesPageComponent} from './admin-queries-page/admin-queries-page.component';
import {AdminStatisticsPageComponent} from './admin-statistics-page/admin-statistics-page.component';
import {AdminLogsPageComponent} from './admin-logs-page/admin-logs-page.component';

export const routes: Routes = [
  {
    path:"login",
    component:LoginPageComponent
  },
  {
    path:"",
    component:MainPageComponent,
    pathMatch: 'full',
  },
  {
    path: "a",
    component: AdminPageComponent,
    children: [
      {
        path:'users',
        component:AdminUserPageComponent,
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
        path: 'logs',
        component:AdminLogsPageComponent,
      }
    ]
  },

];
