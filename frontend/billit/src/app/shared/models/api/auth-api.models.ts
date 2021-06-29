import { ExchangeRate } from '../exchange-rate.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  _id: string;
  currency: string;
  exchangeRates: ExchangeRate[];
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  country: string;
}

export interface CheckLoginRequest {
  jwt: string;
}
