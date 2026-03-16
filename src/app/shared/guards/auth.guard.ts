import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const login = inject(LoginService);

  if (await login.isAuthenticated()) {
    return true;
  }

  router.navigate(['/landing-page']);
  return false;
};
