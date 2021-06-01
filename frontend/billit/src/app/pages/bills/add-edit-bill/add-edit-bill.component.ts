import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';
import { BillsService } from '../../../shared/services/bills.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Bill } from '../../../shared/models/bill.model';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SharedService } from '../../../shared/services/shared.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-edit-bill.component.html',
  styleUrls: ['./add-edit-bill.component.scss'],
})
export class AddEditBillComponent implements OnInit {
  id: string;
  date: string;
  time: string;
  storeName: string;
  billNumber: string;
  products: Array<Product> = [];
  billTotal = 0;
  currency: string;
  isAddMode = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private toastController: ToastController,
    private location: Location,
  ) {
    this.currency = localStorageService.loginData.currency;
    if (this.router.url === '/tabs/bills/add') {
      this.id = null;
      this.products.push(new Product(null, null, null, null));
    } else {
      this.isAddMode = false;
      this.sharedService
        .getBillInfo()
        .pipe(take(1))
        .subscribe(bill => {
          this.id = bill._id;
          this.date = bill.date.toISOString();
          this.time = bill.date.toISOString();
          this.storeName = bill.store;
          this.billNumber = bill.number;
          this.products = bill.products;
          this.billTotal = bill.total;
        });
    }
  }

  ngOnInit() {
  }

  goBack() {
    // TODO: put up dialog of confirmation before leaving
    this.location.back();
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.computeBillTotal();
  }

  addProduct() {
    this.products.push(new Product(null, null, null, null));
  }

  computeBillTotal() {
    this.billTotal = this.products.reduce((accumulator, product) => accumulator + product.price * product.quantity, 0);
  }

  save() {
    // TODO: validate inputs
    const date = new Date(this.date);
    const time = new Date(this.time);
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    const bill = new Bill(this.id, this.storeName, this.billNumber, date, this.billTotal, this.products);

    if (this.isAddMode) {
      this.billsService.addBill(bill).subscribe(
        async () => {
          this.goBack();
          await this.presentSuccessToast();
        },
        () => this.presentErrorToast()
      );
    } else {
      this.billsService.editBill(bill).subscribe(
        async () => {
          this.goBack();
          this.sharedService.sendBillInfo(bill);
          this.sharedService.sendBillInfoUpdateList(bill);
          await this.presentSuccessToast();
        },
        () => this.presentErrorToast()
      );
    }
  }

  private async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: `Bill successfully ${this.isAddMode ? 'added' : 'edited'}!`,
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  private async presentErrorToast() {
    const toast = await this.toastController.create({
      message: `Could not ${this.isAddMode ? 'add' : 'edit'} bill!`,
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }
}
