import { Component, OnDestroy, OnInit } from '@angular/core';
import { BillsService } from '../../shared/services/bills.service';
import { Bill, BILL_TYPES } from '../../shared/models/bill.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { Subscription } from 'rxjs';
import { UpdateBillsAction } from '../../shared/models/enums/update-bills.action';
import { DialogService } from '../../shared/services/dialog.service';
import { ToastService } from '../../shared/services/toast.service';
import { extendMoment } from 'moment-range';

// @ts-ignore
import Moment from 'moment';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit, OnDestroy {
  TRUSTED_TYPE = BILL_TYPES.TRUSTED;
  bills: Array<Bill>;
  currency: string;
  subscription: Subscription;
  intervalsToShow = [];
  private intervals = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    private toastService: ToastService,
  ) {
    this.buildIntervals();

    this.currency = localStorageService.loginData.currency;
    this.billsService
      .getAllBills()
      .subscribe(bills => {
        this.bills = bills;
        this.computeIntervalsToShow();
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
        } else if (action === UpdateBillsAction.EDIT) {
          const index = this.bills.findIndex(b => b._id === bill._id);
          this.bills[index] = bill; // edited bill
          this.bills.sort((a, b) => b.date.getTime() - a.date.getTime());
        } else if (action === UpdateBillsAction.DELETE) {
          const index = this.bills.findIndex(b => b._id === bill._id);
          this.bills.splice(index, 1); // deleted bill
        }
        this.computeIntervalsToShow();
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async removeBill(slidingItem: any, index: number) {
    const shouldDelete = await this.dialogService.presentDeleteDialog();
    if (!shouldDelete) {
      return;
    }
    this.billsService.deleteBill(this.bills[index]).subscribe(
      async () => {
        this.bills.splice(index, 1);
        await this.toastService.presentSuccessToast('Bill successfully deleted!');
      },
      () => this.toastService.presentErrorToast('Could not delete bill!')
    );
  }

  updateFavorite(slidingItem: any, index: number) {
    this.billsService.updateFavorite(this.bills[index]).subscribe(
      async (favorite) => {
        this.bills[index].favorite = favorite;
        const message = favorite ? 'Bill added to favorites!' : 'Bill removed from favorites!';
        setTimeout(() => slidingItem.close(), 300);
        await this.toastService.presentSuccessToast(message);
      },
      () => this.toastService.presentErrorToast('Could not update status!')
    );
  }

  goToAdd() {
    this.router.navigate(['./add'], {relativeTo: this.route});
  }

  goToBillDetails(bill: Bill) {
    this.router.navigate(['./details'], {relativeTo: this.route});
    this.sharedService.sendBillInfo(bill);
  }

  private computeIntervalsToShow() {
    this.intervalsToShow = [];
    this.bills.forEach(bill => {
      this.intervalsToShow.push(this.intervals.find(interval => interval.range.contains(bill.date)));
    });
  }

  private buildIntervals() {
    /* tslint:disable */
    const moment = extendMoment(Moment);
    moment.locale(window.navigator.language);
    const startOfToday = moment().startOf('day');
    const endOfToday = moment().endOf('day');
    const firstDayOfWeek = moment().startOf('week');
    const month = firstDayOfWeek.clone().subtract(15, 'days').startOf('day').toDate().getMonth();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const firstDayOfLastMonth = moment(firstDayOfWeek.clone().subtract(15, 'days').startOf('day').toDate()).startOf('month');

    this.intervals.push({
      name: 'Today',
      range: moment.range(startOfToday, endOfToday)
    });

    this.intervals.push({
      name: 'Yesterday',
      range: moment.range(startOfToday.clone().subtract(1, 'days'), endOfToday.clone().subtract(1, 'days'))
    });

    this.intervals.push({
      name: 'Earlier this week',
      range: moment.range(firstDayOfWeek.clone(), startOfToday.clone().subtract(2, 'days').startOf('day'))
    });

    this.intervals.push({
      name: 'Last week',
      range: moment.range(firstDayOfWeek.clone().subtract(7, 'days').startOf('day'), firstDayOfWeek.clone().subtract(1, 'days').endOf('day'))
    });

    this.intervals.push({
      name: 'Two weeks ago',
      range: moment.range(firstDayOfWeek.clone().subtract(14, 'days').startOf('day'), firstDayOfWeek.clone().subtract(8, 'days').endOf('day'))
    });

    this.intervals.push({
      name: 'Earlier in ' + months[month + 12],
      range: moment.range(firstDayOfLastMonth, firstDayOfWeek.clone().subtract(15, 'days').endOf('day'))
    });

    let firstDayOfLastUsedMonth = firstDayOfLastMonth.clone().subtract(1, 'days').startOf('month');
    if (month + 12 - 1 >= 0) {
      this.intervals.push({
        name: months[month + 12 - 1],
        range: moment.range(firstDayOfLastUsedMonth, firstDayOfLastMonth.clone().subtract(1, 'days').endOf('day'))
      });
    }

    for (let i = 2; i <= 5 && month + 12 - i >= 0; i++) {
      this.intervals.push({
        name: months[month + 12 - i],
        range: moment.range(firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('month'), firstDayOfLastUsedMonth.clone().subtract(1, 'days').endOf('month'))
      });
      firstDayOfLastUsedMonth = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('month');
    }

    const year = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('day').toDate().getFullYear();
    this.intervals.push({
      name: 'Earlier in ' + year.toString(),
      range: moment.range(firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('year'), firstDayOfLastUsedMonth.clone().subtract(1, 'days').endOf('day'))
    });

    let firstDayOfLastYear = firstDayOfLastUsedMonth.clone().subtract(1, 'days').startOf('year').subtract(1, 'days');
    for (let i = 1; i <= 10; i++) {
      this.intervals.push({
        name: (year - i).toString(),
        range: moment.range(firstDayOfLastYear.clone().startOf('year'), firstDayOfLastYear.clone().endOf('year'))
      });
      firstDayOfLastYear = firstDayOfLastYear.clone().startOf('year').subtract(1, 'days');
    }

    this.intervals.push({
      name: 'A long time ago...',
      range: moment.range(moment(new Date('1970-01-01')), firstDayOfLastYear)
    });
    /* tslint:enable */
  }
}
