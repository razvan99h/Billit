import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sourceBill = new BehaviorSubject<Bill>(null);
  private sourceBillUpdateList = new BehaviorSubject<Bill>(null);

  constructor() {
  }

  getBillInfo(): Observable<Bill> {
    return this.sourceBill.asObservable();
  }

  sendBillInfo(bill: Bill): void {
    this.sourceBill.next(bill);
  }

  getBillInfoUpdateList(): Observable<Bill> {
    return this.sourceBillUpdateList.asObservable();
  }

  sendBillInfoUpdateList(bill: Bill): void {
    this.sourceBillUpdateList.next(bill);
  }
}
