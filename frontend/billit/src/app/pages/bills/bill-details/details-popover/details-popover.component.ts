import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DetailsPopoverAction } from '../../../../shared/models/popovers/details-popover.action';

@Component({
  selector: 'app-details-popover',
  templateUrl: './details-popover.component.html',
  styleUrls: ['./details-popover.component.scss'],
})
export class DetailsPopoverComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
  ) {
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
