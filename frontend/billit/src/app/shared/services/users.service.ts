import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { API_URL } from './constants';
import { ChangePasswordRequest } from '../models/api/users-api.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = API_URL + 'users/';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getUserDetails(userId: string): Observable<User> {
    console.log('getUserDetails <<< userId: ', userId);
    return this.httpClient
      .get<User>(this.url + userId)
      .pipe(
        map(response => {
          console.log('getUserDetails >>> response:', response);
          return User.fromJSON(response);
        }));
  }

  editUser(user: User): Observable<void> {
    console.log('editUser <<< user: ', user);
    return this.httpClient
      .put(this.url + user._id, user)
      .pipe(
        map(response => {
          console.log('editUser >>> response:', response);
          return;
        }));
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    console.log('changePassword <<< request: ', request);
    return this.httpClient
      .patch(this.url + request.userId, request)
      .pipe(
        map(response => {
          console.log('changePassword >>> response:', response);
          return;
        }));
  }

  deleteUser(userId: string): Observable<void> {
    console.log('deleteUser <<< userId: ', userId);
    return this.httpClient
      .delete(this.url + userId)
      .pipe(
        map(response => {
          console.log('deleteUser >>> response:', response);
          return;
        }));
  }
}
