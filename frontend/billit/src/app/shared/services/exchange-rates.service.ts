import { API_URL } from './constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRate } from '../models/exchange-rate.model';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {
  private url = API_URL + 'exchange-rates/';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getAllExchangeRates(): Observable<Array<ExchangeRate>> {
    console.log('getAllExchangeRates <<<');
    return this.httpClient
      .get<Array<ExchangeRate>>(this.url )
      .pipe(
        map(response => {
          console.log('getAllExchangeRates >>> response:', response);
          return response.map(exchangeRateJSON => ExchangeRate.fromJSON(exchangeRateJSON));
        }));
  }
}
