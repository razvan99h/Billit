import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../shared/services/shared.service';
import { Bill, BILL_TYPES } from '../../../shared/models/bill.model';
import { PopoverController } from '@ionic/angular';
import { DetailsPopoverComponent } from './details-popover/details-popover.component';
import { DetailsPopoverAction } from '../../../shared/models/enums/details-popover.action';
import { Subscription } from 'rxjs';
import { BillsService } from '../../../shared/services/bills.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { UpdateBillsAction } from '../../../shared/models/enums/update-bills.action';
import { ToastService } from '../../../shared/services/toast.service';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
})
export class BillDetailsComponent implements OnInit, OnDestroy {
  TRUSTED_TYPE = BILL_TYPES.TRUSTED;
  bill: Bill = Bill.emptyBill();
  currency: string;
  subscription: Subscription;
  billCategories = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billsService: BillsService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private toastService: ToastService,
    private dialogService: DialogService,
  ) {
    this.currency = this.localStorageService.loginData.currency;
  }

  ngOnInit() {
    this.subscription = this.sharedService
      .getBillInfo()
      .subscribe(bill => {
        this.bill = bill;
        this.billCategories = bill.getCategories();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: DetailsPopoverComponent,
      componentProps: {bill: this.bill},
      cssClass: 'billit-details-popover',
      translucent: true,
      event
    });
    await popover.present();
    const {data} = await popover.onDidDismiss();

    if (data === DetailsPopoverAction.EDIT) {
      this.router.navigate(['./../edit'], {relativeTo: this.route});
      this.sharedService.sendBillInfo(this.bill);
    } else if (data === DetailsPopoverAction.DELETE) {
      const shouldDelete = await this.dialogService.presentDeleteDialog();
      if (!shouldDelete) {
        return;
      }
      this.billsService.deleteBill(this.bill).subscribe(
        async () => {
          this.goBack();
          this.sharedService.sendBillInfoUpdateList([
            Bill.emptyBill(this.bill._id),
            UpdateBillsAction.DELETE
          ]);
          await this.toastService.presentSuccessToast('Bill successfully deleted!');
        },
        () => this.toastService.presentErrorToast('Could not delete bill!')
      );
    }
  }

  async updateFavorite() {
    this.billsService.updateFavorite(this.bill).subscribe(
      async (favorite) => {
        this.bill.favorite = favorite;
        const message = favorite ? 'Bill added to favorites!' : 'Bill removed from favorites!';
        await this.toastService.presentSuccessToast(message);
      },
      () => this.toastService.presentErrorToast('Could not update status!')
    );
  }

  goBack() {
    this.router.navigate(['./..'], {relativeTo: this.route});
  }
}
