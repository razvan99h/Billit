import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bill } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillsService {
  private url = environment.API_URL + 'bills/';

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

  addBill(bill: Bill): Observable<void> {
    console.log('addBill <<< bill: ', bill);
    return this.httpClient
      .post<Array<Bill>>(this.url, bill)
      .pipe(
        map(response => {
          console.log('addBill >>> response:', response);
          return;
        }));
  }
}
