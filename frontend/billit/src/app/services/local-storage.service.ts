import { Injectable } from '@angular/core';
import { LoginData } from '../models/local-storage/login-data.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private loginPath = 'billit-login';

  constructor() {
  }

  get loginData(): LoginData {
    return JSON.parse(localStorage.getItem(this.loginPath));
  }

  set loginData(value: LoginData) {
    localStorage.setItem(this.loginPath, JSON.stringify(value));
  }

  bla() {

  }
}
