import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { TabsComponent } from './pages/tabs/tabs.component';

export const routes: Routes = [
  {
    path: 'home',
    component: TabsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'backup'
      },
      {
        path: 'backup',
        loadComponent: () => import('./pages/tabs/home/home.component').then((m) => m.HomePage),
        canActivate: [authGuard]
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/tabs/settings/settings.component').then((m) => m.SettingsPage),
        canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'landing-page',
    loadComponent: () => import('./pages/landing-page/landing-page.component').then((m) => m.LandingPage),
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },
];
