import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from "@angular/common/http";
import { routes } from './app/app.routes';

console.log('Bootstrapping application with config:', appConfig); // Debug log

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
