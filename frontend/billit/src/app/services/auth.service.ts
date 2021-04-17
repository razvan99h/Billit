import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { map } from 'rxjs/operators';
import { LoginData } from '../models/local-storage/login-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.API_URL + 'auth/login';

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
  ) {
  }

  getAuthorizationToken(): string {
    if (!this.localStorageService.loginData) {
      return '';
    }
    return this.localStorageService.loginData.jwt;
  }

  login(email: string, password: string): Observable<void> {
    console.log('login <<< email, password:', email, password);
    return this.httpClient
      .post<LoginData>(this.url, {
        email, password,
      })
      .pipe(
        map(response => {
          console.log('login >>> response:', response);
          this.localStorageService.loginData = response;
        }));
  }
}
