import { inject } from "@angular/core"
import { Router } from "@angular/router";
import { LoginService } from "../services/login.service";

export const AuthGuard = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    return true;
  }

  router.navigate(['']);
  return false;
}

export const PreventGuard = (): boolean => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isAuthenticated()) {
    router.navigate(['/admin/lapangan']);
    return false;
  }

  return true;
}