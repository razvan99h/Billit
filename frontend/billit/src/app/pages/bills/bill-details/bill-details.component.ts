import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Bill } from '../../../shared/models/bill.model';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { DetailsPopoverComponent } from './details-popover/details-popover.component';
import { DetailsPopoverAction } from '../../../shared/models/enums/details-popover.action';
import { Subscription } from 'rxjs';
import { BillsService } from '../../../shared/services/bills.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UpdateBillsAction } from '../../../shared/models/enums/update-bills.action';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
})
export class BillDetailsComponent implements OnInit, OnDestroy {
  bill: Bill = new Bill(null, null, null, null, null, []);
  currency: string;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private location: Location,
    private alertController: AlertController,
  ) {
    this.currency = this.localStorageService.loginData.currency;
  }

  ngOnInit() {
    this.subscription = this.sharedService
      .getBillInfo()
      .subscribe(bill => {
        this.bill = bill;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goBack() {
    this.router.navigate(['./..'], {relativeTo: this.route});
  }

  async presentDeleteDialog(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Confirm deleting bill',
      message: 'Are you sure you want to delete this bill?',
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

    return role === 'confirm';
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: DetailsPopoverComponent,
      event: ev,
      cssClass: 'billit-details-popover',
      showBackdrop: false,
      translucent: true
    });
    await popover.present();
    const {data} = await popover.onDidDismiss();

    if (data === DetailsPopoverAction.EDIT) {
      this.router.navigate(['./../edit'], {relativeTo: this.route});
      this.sharedService.sendBillInfo(this.bill);
    } else if (data === DetailsPopoverAction.DELETE) {
      const shouldDelete = await this.presentDeleteDialog();
      if (!shouldDelete) {
        return;
      }
      this.billsService.deleteBill(this.bill).subscribe(
        async () => {
          this.goBack();
          this.sharedService.sendBillInfoUpdateList([
            new Bill(this.bill._id, null, null, null, null, null),
            UpdateBillsAction.DELETE
          ]);
          await this.presentSuccessToast();
        },
        () => this.presentErrorToast()
      );
    }
  }

  private async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: `Bill successfully deleted!`,
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  private async presentErrorToast() {
    const toast = await this.toastController.create({
      message: `Could not delete bill!`,
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }
}
