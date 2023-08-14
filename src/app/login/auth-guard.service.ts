// auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router'; // Updated import
import { AuthService } from './auth-service.service'; // Your AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean | UrlTree> {
    return this.authService.isAuthenticated().then(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
