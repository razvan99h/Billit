import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { DetailsPopoverAction } from '../../../../shared/models/enums/details-popover.action';
import { Bill, BILL_TYPES } from '../../../../shared/models/bill.model';

@Component({
  selector: 'app-details-popover',
  templateUrl: './details-popover.component.html',
  styleUrls: ['./details-popover.component.scss'],
})
export class DetailsPopoverComponent implements OnInit {
  TRUSTED_TYPE = BILL_TYPES.TRUSTED;
  bill: Bill;

  constructor(
    private popoverController: PopoverController,
    navParams: NavParams,
  ) {
    this.bill = navParams.get('bill');
  }

  ngOnInit() {
  }

  async clickedEdit() {
    await this.popoverController.dismiss(DetailsPopoverAction.EDIT);
  }

  async clickedDelete() {
    await this.popoverController.dismiss(DetailsPopoverAction.DELETE);
  }

}
