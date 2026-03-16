import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const redirectGuard: CanActivateFn = async () => {
  const router = inject(Router);
  router.navigate(["/home/backup"]);
  return true;
};
