import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../models/bill.model';
import { API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  private url = API_URL + 'bills/';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getAllBills(): Observable<Array<Bill>> {
    console.log('getAllBills <<<');
    return this.httpClient
      .get<Array<Bill>>(this.url + 'owned')
      .pipe(
        map(response => {
          console.log('getAllBills >>> response:', response);
          return response.map(billJSON => Bill.fromJSON(billJSON));
        }));
  }

  addBill(bill: Bill): Observable<Bill> {
    console.log('addBill <<< bill: ', bill);
    return this.httpClient
      .post<Array<Bill>>(this.url, bill)
      .pipe(
        map(response => {
          console.log('addBill >>> response:', response);
          return Bill.fromJSON(response);
        }));
  }

  editBill(bill: Bill): Observable<Bill> {
    console.log('editBill <<< bill: ', bill);
    return this.httpClient
      .put<Array<Bill>>(this.url + bill._id, bill)
      .pipe(
        map(response => {
          console.log('editBill >>> response:', response);
          return Bill.fromJSON(response);
        }));
  }

  deleteBill(bill: Bill): Observable<void> {
    console.log('deleteBill <<< bill: ', bill);
    return this.httpClient
      .delete<Array<Bill>>(this.url + bill._id)
      .pipe(
        map(response => {
          console.log('deleteBill >>> response:', response);
          return;
        }));
  }

  updateFavorite(bill: Bill): Observable<boolean> {
    console.log('updateFavorite <<< bill: ', bill);
    return this.httpClient
      .put<Bill>(`${this.url}/favorite/${bill._id}`, {favorite: !bill.favorite})
      .pipe(
        map(response => {
          console.log('updateFavorite >>> response:', response);
          return response.favorite;
        }));
  }
}
