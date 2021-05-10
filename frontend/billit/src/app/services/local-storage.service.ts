import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/api/auth-api.models';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private loginPath = 'billit-login';

  constructor() {
  }

  get loginData(): LoginResponse {
    return JSON.parse(localStorage.getItem(this.loginPath));
  }

  set loginData(value: LoginResponse) {
    localStorage.setItem(this.loginPath, JSON.stringify(value));
  }

  bla() {

  }
}
