import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Bill } from '../../../shared/models/bill.model';
import { PopoverController, ToastController } from '@ionic/angular';
import { DetailsPopoverComponent } from './details-popover/details-popover.component';
import { DetailsPopoverAction } from '../../../shared/models/popovers/details-popover.action';
import { Subscription } from 'rxjs';
import { BillsService } from '../../../shared/services/bills.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
})
export class BillDetailsComponent implements OnInit, OnDestroy {
  bill: Bill = new Bill(null, null, null, null, null, []);
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private toastController: ToastController,
    private location: Location,
  ) {

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
    this.location.back();
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
      this.billsService.deleteBill(this.bill).subscribe(
        async () => {
          this.goBack();
          this.sharedService.sendBillInfoUpdateList(new Bill(this.bill._id, null, null, null, null, null));
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
