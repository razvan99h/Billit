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
import {
  CURRENCIES,
  ERROR_CATEGORY_LONG,
  ERROR_CATEGORY_REQUIRED,
  ERROR_NUMBER_LONG,
  ERROR_NUMBER_REQUIRED,
  ERROR_PRICE_INVALID,
  ERROR_PRODUCT_NAME_LONG,
  ERROR_PRODUCT_NAME_REQUIRED,
  ERROR_QUANTITY_BIG,
  ERROR_QUANTITY_INVALID,
  ERROR_STORE_LONG,
  ERROR_STORE_REQUIRED
} from '../../../shared/services/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { extendMoment } from 'moment-range';
// @ts-ignore
import Moment from 'moment';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-edit-bill.component.html',
  styleUrls: ['./add-edit-bill.component.scss'],
})
export class AddEditBillComponent implements OnInit {
  readonly ERROR_STORE_REQUIRED = ERROR_STORE_REQUIRED;
  readonly ERROR_STORE_LONG = ERROR_STORE_LONG;
  readonly ERROR_CATEGORY_REQUIRED = ERROR_CATEGORY_REQUIRED;
  readonly ERROR_CATEGORY_LONG = ERROR_CATEGORY_LONG;
  readonly ERROR_NUMBER_REQUIRED = ERROR_NUMBER_REQUIRED;
  readonly ERROR_NUMBER_LONG = ERROR_NUMBER_LONG;
  readonly ERROR_PRODUCT_NAME_REQUIRED = ERROR_PRODUCT_NAME_REQUIRED;
  readonly ERROR_PRODUCT_NAME_LONG = ERROR_PRODUCT_NAME_LONG;
  readonly ERROR_QUANTITY_INVALID = ERROR_QUANTITY_INVALID;
  readonly ERROR_QUANTITY_BIG = ERROR_QUANTITY_BIG;
  readonly ERROR_PRICE_INVALID = ERROR_PRICE_INVALID;
  form: FormGroup;
  showErrors = false;
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
  moment;
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
    private formBuilder: FormBuilder,
  ) {
    this.userCurrency = localStorageService.loginData.currency;
    this.moment = extendMoment(Moment);
    this.moment.locale(window.navigator.language);
    this.initializeForm();

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
          this.products = [...bill.products.map(p => (new Product(p._id, p.name, p.price, p.quantity, p.category)))];
          this.billTotal = bill.total;
          this.form.value.store = bill.store;
          this.form.value.number = bill.number;
          this.form.value.category = bill.category;
          (this.form.controls.products as FormArray).removeAt(0); // remove the empty form added at initialize
          this.products.forEach(product => {
            (this.form.controls.products as FormArray).push(this.addProductForm());
            const last = this.form.value.products.length - 1;
            this.form.value.products[last] = {
              name: product.name,
              quantity: product.quantity,
              price: product.price,
            };
          });
        });
    }
  }

  ngOnInit() {
  }

  save() {
    this.showErrors = true;
    if (!this.form.valid) {
      return;
    }
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
          this.navigateBack();
          this.sharedService.sendBillInfoUpdateList([newBill, UpdateBillsAction.ADD]);
          await this.toastService.presentSuccessToast('Bill successfully added!');
        },
        () => this.toastService.presentErrorToast('Could not add bill!')
      );
    } else {
      this.billsService.editBill(bill).subscribe(
        async (editedBill) => {
          this.navigateBack();
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
      this.navigateBack();
    }
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    (this.form.value.products as Array<any>).splice(index, 1);
    this.computeBillTotal();
  }

  addProduct() {
    this.products.push(Product.empty());
    (this.form.controls.products as FormArray).push(this.addProductForm());
  }

  computeBillTotal() {
    this.billTotal = this.products.reduce((accumulator, product) => accumulator + product.price * product.quantity, 0);
  }

  getProductFormControl(index: number): FormGroup {
    return (this.form.controls.products as FormArray).controls[index] as FormGroup;
  }

  private initializeForm() {
    this.form = this.formBuilder.group({
      store: [
        null, [
          Validators.required,
          Validators.maxLength(50),
        ]
      ],
      category: [
        null, [
          Validators.required,
          Validators.maxLength(20),
        ]
      ],
      number: [
        null, [
          Validators.required,
          Validators.maxLength(20),
        ]
      ],
      products: this.formBuilder.array([
        this.addProductForm(),
      ])
    });
  }

  private addProductForm() {
    return this.formBuilder.group({
      name: [
        null, [
          Validators.required,
          Validators.maxLength(30),
        ]
      ],
      quantity: [
        null, [
          Validators.required,
          Validators.min(0),
          Validators.max(9999),
        ]
      ],
      price: [
        null, [
          Validators.required,
          Validators.min(0),
        ]
      ],
    });
  }

  private navigateBack() {
    this.location.back();
  }
}
