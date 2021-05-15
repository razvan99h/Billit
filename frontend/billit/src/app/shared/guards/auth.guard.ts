import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    const jwt = this.localStorageService.loginData?.jwt;
    const isLoggedIn = jwt
      ? this.authService
        .isLoggedIn({jwt})
        .pipe(catchError(_ => EMPTY))
      : false;
    if (!isLoggedIn) {
      this.router.navigateByUrl('auth');
    }
    return isLoggedIn;
  }
}
