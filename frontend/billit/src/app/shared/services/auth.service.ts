import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { map } from 'rxjs/operators';
import { CheckLoginRequest, LoginRequest, LoginResponse, RegisterRequest } from '../models/api/auth-api.models';
import { API_URL } from './constants';
import { ExchangeRate } from '../models/exchange-rate.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = API_URL + 'auth/';

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

  isLoggedIn(request: CheckLoginRequest): Observable<boolean> {
    console.log('isLoggedIn <<< request', request);
    return this.httpClient
      .post<boolean>(this.url + 'logged-in', request)
      .pipe(
        map(response => {
          console.log('isLoggedIn >>> response:', response);
          return response;
        }));
  }

  login(request: LoginRequest): Observable<void> {
    console.log('login <<< request', request);
    return this.httpClient
      .post<LoginResponse>(this.url + 'login', request)
      .pipe(
        map(response => {
          console.log('login >>> response:', response);
          this.localStorageService.loginData = {
            ...response,
            exchangeRates: response.exchangeRates.map(exchangeRateJSON => ExchangeRate.fromJSON(exchangeRateJSON))
          };
        }));
  }

  register(request: RegisterRequest): Observable<void> {
    console.log('register <<< request:', request);
    return this.httpClient
      .post(this.url + 'register', request)
      .pipe(
        map(response => {
          console.log('register >>> response:', response);
        }));
  }

  logout() {
    console.log('logout <<<');
    this.localStorageService.clearData();
    console.log('logout >>>');
  }
}
