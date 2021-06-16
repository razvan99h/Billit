import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';
import { BillsService } from '../../../shared/services/bills.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Bill, BILL_TYPES } from '../../../shared/models/bill.model';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { SharedService } from '../../../shared/services/shared.service';
import { take } from 'rxjs/operators';
import { UpdateBillsAction } from '../../../shared/models/enums/update-bills.action';
import { CURRENCIES } from '../../../shared/services/constants';
import { ToastService } from '../../../shared/services/toast.service';

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
  billCurrency: string;
  billCategory: string;
  products: Array<Product> = [];
  billTotal = 0;
  isAddMode = true;
  currencies = CURRENCIES;
  private readonly userCurrency: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private location: Location,
    private alertController: AlertController,
  ) {
    this.userCurrency = localStorageService.loginData.currency;

    if (this.router.url === '/tabs/bills/add') {
      this.id = null;
      this.products.push(Product.empty());
      this.date = this.time = new Date().toISOString();
      this.billCurrency = this.userCurrency;
    } else {
      this.isAddMode = false;
      this.sharedService
        .getBillInfo()
        .pipe(take(1))
        .subscribe(bill => {
          this.id = bill._id;
          this.date = this.time = bill.date.toISOString();
          this.storeName = bill.store;
          this.billNumber = bill.number;
          this.billCurrency = bill.currency;
          this.billCategory = bill.category;
          this.products = bill.products;
          this.billTotal = bill.total;
        });
    }
  }

  ngOnInit() {
  }

  save() {
    // TODO: validate inputs
    const date = new Date(this.date);
    const time = new Date(this.time);
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    const bill = new Bill(
      this.id,
      this.storeName,
      this.billNumber,
      this.billCurrency,
      date,
      BILL_TYPES.NORMAL,
      this.billCategory,
      false,
      this.billTotal,
      this.products);

    if (this.isAddMode) {
      this.billsService.addBill(bill).subscribe(
        async (newBill) => {
          this.location.back();
          this.sharedService.sendBillInfoUpdateList([newBill, UpdateBillsAction.ADD]);
          await this.toastService.presentSuccessToast('Bill successfully added!');
        },
        () => this.toastService.presentErrorToast('Could not add bill!')
      );
    } else {
      this.billsService.editBill(bill).subscribe(
        async (editedBill) => {
          this.location.back();
          this.sharedService.sendBillInfo(editedBill);
          this.sharedService.sendBillInfoUpdateList([editedBill, UpdateBillsAction.EDIT]);
          await this.toastService.presentSuccessToast('Bill successfully edited!');
        },
        () => this.toastService.presentErrorToast('Could not edit bill!')
      );
    }
  }

  async goBack() {
    const alert = await this.alertController.create({
      header: 'Confirm exiting form',
      message: 'Are you sure you want to leave this form?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
        }]
    });

    await alert.present();
    const {role} = await alert.onDidDismiss();

    if (role === 'confirm') {
      this.location.back();
    }
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.computeBillTotal();
  }

  addProduct() {
    this.products.push(Product.empty());
  }

  computeBillTotal() {
    this.billTotal = this.products.reduce((accumulator, product) => accumulator + product.price * product.quantity, 0);
  }
}
