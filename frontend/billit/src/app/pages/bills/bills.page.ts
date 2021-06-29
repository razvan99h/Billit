import { Component, OnInit } from '@angular/core';
import { BillsService } from '../../shared/services/bills.service';
import { Bill, BILL_TYPES } from '../../shared/models/bill.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { UpdateBillsAction } from '../../shared/models/enums/update-bills.action';
import { DialogService } from '../../shared/services/dialog.service';
import { ToastService } from '../../shared/services/toast.service';
import { extendMoment } from 'moment-range';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, PopoverController } from '@ionic/angular';
import { FilterPopoverComponent } from './filter-popover/filter-popover.component';
import { FilterPopoverAction } from '../../shared/models/enums/filter-popover.action';
// @ts-ignore
import Moment from 'moment';
import { Currencies } from '../../shared/models/enums/currencies';
import { ExchangeRate } from '../../shared/models/exchange-rate.model';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})
export class BillsPage implements OnInit {
  TRUSTED_TYPE = BILL_TYPES.TRUSTED;
  billsToShow: Array<Bill>;
  intervalsToShow = [];
  currency: string;
  searchBarOpen = false;
  searchText = '';
  private bills: Array<Bill>;
  private intervals = [];
  private currentFilter: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private dialogService: DialogService,
    private toastService: ToastService,
    private barcodeScanner: BarcodeScanner,
    private popoverController: PopoverController,
    public loadingController: LoadingController,
  ) {
    this.currency = this.localStorageService.loginData.currency;
    this.currentFilter = FilterPopoverAction.DATE_DESC;

    this.buildIntervals();
    this.fetchBills();
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
          this.bills.splice(index, 1);
        }

        this.currentFilter = FilterPopoverAction.DATE_DESC;
        this.initialiseBillsToShow();
        this.computeIntervalsToShow();
      });
  }

  ngOnInit() {
  }

  fetchBills(event?) {
    this.billsService
      .getAllBills()
      .subscribe(async (bills) => {
        this.bills = bills;
        this.initialiseBillsToShow();
        this.computeIntervalsToShow();
        if (event) {
          event.target.complete();
        }
      }, async () => {
        if (event) {
          await this.toastService.presentErrorToast('Could not load bills!');
          event.target.complete();
        }
      });
  }

  async removeBill(slidingItem: any, index: number) {
    const shouldDelete = await this.dialogService.presentDeleteDialog();
    if (!shouldDelete) {
      return;
    }
    this.billsService.deleteBill(this.billsToShow[index]).subscribe(
      async () => {
        const deletedBill: Bill = this.billsToShow.splice(index, 1)[0];
        this.intervalsToShow.splice(index, 1);

        const originalIndex = this.bills.findIndex(bill => bill._id === deletedBill._id);
        this.bills.splice(originalIndex, 1);

        await this.toastService.presentSuccessToast('Bill successfully deleted!');
      },
      () => this.toastService.presentErrorToast('Could not delete bill!')
    );
  }

  updateFavorite(slidingItem: any, index: number) {
    this.billsService
      .updateFavorite(this.billsToShow[index])
      .subscribe(
        async (favorite) => {
          this.billsToShow[index].favorite = favorite;

          const originalIndex = this.bills.findIndex(bill => bill._id === this.billsToShow[index]._id);
          this.bills[originalIndex].favorite = favorite;

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

  openQRScanner() {
    this.barcodeScanner.scan({formats: 'QR_CODE'}).then(barcodeData => {
      const scannedBill = Bill.fromBarcodeJSON(JSON.parse(barcodeData.text));
      this.billsService
        .addBill(scannedBill)
        .subscribe(async (newBill) => {
            this.bills.splice(0, 0, newBill);
            this.initialiseBillsToShow();
            this.computeIntervalsToShow();
            await this.toastService.presentSuccessToast('Bill successfully scanned!');
          }, () => this.toastService.presentErrorToast('Could not add scanned bill!')
        );
    }).catch(async err => {
      console.log('QR Error', err);
      await this.toastService.presentErrorToast('Could not handle QR scanning!');
    });
  }

  openSearchBar() {
    this.billsToShow = [];
    this.intervalsToShow = [];
    this.searchBarOpen = true;
  }

  closeSearchBar() {
    this.initialiseBillsToShow();
    this.computeIntervalsToShow();
    this.searchBarOpen = false;
  }

  search(event: any) {
    this.searchText = event.target.value;
    if (this.searchText.length <= 1) {
      this.billsToShow = [];
      this.intervalsToShow = [];
      return;
    }

    this.initialiseBillsToShow();
    this.billsToShow = this.billsToShow.filter((bill) => {
      let itemsToSearch = [
        bill.store,
        bill.number,
        ...(bill.products.map(p => p.name)),
      ];
      if (bill.category) {
        itemsToSearch = [...itemsToSearch, bill.category];
      } else {
        itemsToSearch = [...itemsToSearch, ...(bill.products.map(p => p.category))];
      }
      return itemsToSearch.find(item => item.toLowerCase().includes(this.searchText.toLowerCase()));
    });
    if (this.billsToShow.length > 0) {
      this.computeIntervalsToShow();
    }
  }

  async presentFilterPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FilterPopoverComponent,
      componentProps: {currentFilter: this.currentFilter},
      event: ev,
      cssClass: 'billit-filter-popover',
      translucent: true
    });
    await popover.present();
    const {data} = await popover.onDidDismiss();
    const filter = data;

    if (!filter || filter === this.currentFilter) {
      return;
    }
    if (filter === FilterPopoverAction.DATE_DESC || filter === FilterPopoverAction.DATE_ASC ||
      filter === FilterPopoverAction.PRICE_DESC || filter === FilterPopoverAction.PRICE_ASC) {
      await this.sortBills(filter);
    } else {
      await this.filterBills(filter);
    }
    this.currentFilter = filter;
  }

  private async sortBills(filter: FilterPopoverAction) {
    const loading = await this.loadingController.create({});
    await loading.present();

    const commonCurrency = Currencies.EUR;
    let exchangeRates: ExchangeRate[];
    if (filter === FilterPopoverAction.PRICE_DESC || filter === FilterPopoverAction.PRICE_ASC) {
      exchangeRates = this.localStorageService.loginData.exchangeRates;
    }

    this.initialiseBillsToShow();
    this.billsToShow = this.billsToShow.sort((b1, b2) => {
      if (filter === FilterPopoverAction.DATE_DESC || filter === FilterPopoverAction.DATE_ASC) {
        const order = filter === FilterPopoverAction.DATE_DESC ? 1 : -1;
        return order * (b2.date.getTime() - b1.date.getTime());
      }
      if (filter === FilterPopoverAction.PRICE_DESC || filter === FilterPopoverAction.PRICE_ASC) {
        const order = filter === FilterPopoverAction.PRICE_DESC ? 1 : -1;
        const baseConversion1 = exchangeRates.find(e => e.base === b1.currency);
        const baseConversion2 = exchangeRates.find(e => e.base === b2.currency);
        return order * (baseConversion2.rates[commonCurrency] * b2.total - baseConversion1.rates[commonCurrency] * b1.total);
      }
      return 0;
    });
    if (filter === FilterPopoverAction.DATE_DESC || filter === FilterPopoverAction.DATE_ASC) {
      this.computeIntervalsToShow();
    }
    if (filter === FilterPopoverAction.PRICE_DESC || filter === FilterPopoverAction.PRICE_ASC) {
      this.intervalsToShow = [];
    }

    await loading.dismiss();
  }

  private async filterBills(filter: FilterPopoverAction) {
    const loading = await this.loadingController.create({});
    await loading.present();

    this.initialiseBillsToShow();
    this.billsToShow = this.billsToShow.filter((bill) => {
      if (filter === FilterPopoverAction.TRUSTED) {
        return bill.type === BILL_TYPES.TRUSTED;
      }
      if (filter === FilterPopoverAction.FAVOURITES) {
        return bill.favorite;
      }
      return false;
    });
    this.computeIntervalsToShow();

    await loading.dismiss();
  }

  private initialiseBillsToShow() {
    this.billsToShow = this.bills.map(b => Bill.fromJSON({...b}));
  }

  private computeIntervalsToShow() {
    this.intervalsToShow = [];
    this.billsToShow.forEach(bill => {
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
      range: moment.range(firstDayOfWeek.clone(), startOfToday.clone().subtract(2, 'days').endOf('day'))
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
