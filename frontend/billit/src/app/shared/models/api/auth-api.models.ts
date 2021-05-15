export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  _id: string;
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
