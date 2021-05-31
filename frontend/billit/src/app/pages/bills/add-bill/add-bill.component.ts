import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';
import { BillsService } from '../../../shared/services/bills.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Bill } from '../../../shared/models/bill.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent implements OnInit {
  date: string;
  time: string;
  storeName: string;
  billNumber: string;
  products: Array<Product> = [];
  currency: string;
  billTotal = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private toastController: ToastController,
  ) {
    this.currency = localStorageService.loginData.currency;
    this.products.push(new Product(null, null, null));
  }

  ngOnInit() {
  }

  goBack() {
    // TODO: put up dialog of confirmation before leaving
    this.router.navigate(['./..'], {relativeTo: this.route});
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  addProduct() {
    this.products.push(new Product(null, null, null));
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
    const billToAdd = new Bill(this.storeName, this.billNumber, date, this.billTotal, this.products);

    this.billsService.addBill(billToAdd).subscribe(
      async () => {
        this.goBack();
        await this.presentSuccessToast();
      },
      () => this.presentErrorToast()
    );
  }

  private async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Bill successfully added!',
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  private async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Could not add bill!',
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }

}
