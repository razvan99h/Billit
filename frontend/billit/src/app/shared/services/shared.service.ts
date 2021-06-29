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
  private sourceMyAccountEditCall = new BehaviorSubject<boolean>(null);

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

  getMyAccountEditCall(): Observable<boolean> {
    return this.sourceMyAccountEditCall.asObservable();
  }

  sendMyAccountEditCall(isEdit: boolean): void {
    this.sourceMyAccountEditCall.next(isEdit);
  }
}
