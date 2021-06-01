import { Component, OnDestroy, OnInit } from '@angular/core';
import { BillsService } from '../../shared/services/bills.service';
import { Bill } from '../../shared/models/bill.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { UpdateBillsAction } from '../../shared/models/enums/update-bills.action';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit, OnDestroy {
  bills: Array<Bill>;
  currency: string;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
  ) {
    this.currency = localStorageService.loginData.currency;
    this.billsService
      .getAllBills()
      .subscribe(bills => {
        this.bills = bills;
      });
    this.sharedService
      .getBillInfoUpdateList()
      .subscribe((info: [Bill, UpdateBillsAction]) => {
        if (!info || !info[0]) {
          return;
        }
        const bill = info[0];
        const action = info[1];

        if (action === UpdateBillsAction.ADD) {
          const index = this.bills.findIndex(b => b.date < bill.date);
          this.bills.splice(index, 0, bill);
        }
        else if (action === UpdateBillsAction.EDIT) {
          this.bills.push(bill); // edited bill
          this.bills.sort((a, b) => b.date.getTime() - a.date.getTime());
        }
        else if (action === UpdateBillsAction.DELETE) {
          const index = this.bills.findIndex(b => b._id === bill._id);
          this.bills.splice(index, 1); // deleted bill
        }
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToAdd() {
    this.router.navigate(['./add'], {relativeTo: this.route});
  }

  goToBillDetails(bill: Bill) {
    this.router.navigate(['./details'], {relativeTo: this.route});
    this.sharedService.sendBillInfo(bill);
  }
}
