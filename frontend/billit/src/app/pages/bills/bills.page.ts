import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../shared/services/bills.service';
import { Bill } from '../../shared/models/bill.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit {
  bills: Array<Bill>;
  currency: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
  ) {
    billsService.getAllBills().subscribe(bills => {
      this.bills = bills;
    });
    this.currency = localStorageService.loginData.currency;
  }

  ngOnInit() {
  }

  goToAdd() {
    this.router.navigate(['./add'], {relativeTo: this.route});
  }

}
