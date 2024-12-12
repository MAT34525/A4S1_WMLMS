/// <reference types="@angular/localize" />

import { appConfig } from './app/app.config';
import '@angular/compiler';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

if ((window as any).ENABLE_PROD_MODE) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
