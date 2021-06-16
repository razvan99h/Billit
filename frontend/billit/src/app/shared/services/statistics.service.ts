import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Statistics } from '../models/statistics.model';
import { StatisticsRequest } from '../models/api/statistics-api.models';
import { API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private url = API_URL + 'statistics/';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getStatistics(type: string, request: StatisticsRequest): Observable<Statistics> {
    console.log('getStatistics <<< type, request:', type, request);
    let paramString = `?timeZone=${request.timeZone}&currency=${request.currency}`;
    if (request.date) {
      paramString += `&date=${request.date}`;
    } else if (request.month) {
      paramString += `&month=${request.month}`;
    } else if (request.from && request.to) {
      paramString += `&from=${request.from}&to=${request.to}`;
    }
    return this.httpClient
      .get<Statistics>(this.url + type + paramString)
      .pipe(
        map(response => {
          console.log('getStatistics >>> response:', response);
          return Statistics.fromJSON(response);
        }));
  }
}
