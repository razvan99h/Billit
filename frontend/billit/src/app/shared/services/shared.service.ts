import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from '../models/bill.model';
import { UpdateBillsAction } from '../models/enums/update-bills.action';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sourceBill = new BehaviorSubject<Bill>(null);
  private sourceBillUpdateList = new BehaviorSubject<[Bill, UpdateBillsAction]>(null);

  constructor() {
  }

  getBillInfo(): Observable<Bill> {
    return this.sourceBill.asObservable();
  }

  sendBillInfo(bill: Bill): void {
    this.sourceBill.next(bill);
  }

  getBillInfoUpdateList(): Observable<[Bill, UpdateBillsAction]> {
    return this.sourceBillUpdateList.asObservable();
  }

  sendBillInfoUpdateList(info: [Bill, UpdateBillsAction]): void {
    this.sourceBillUpdateList.next(info);
  }
}
