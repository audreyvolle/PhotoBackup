import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'landing-page',
    loadComponent: () => import('./landing-page/landing-page.component').then((m) => m.LandingPage),
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
];
