import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { FilterPopoverAction } from '../../../shared/models/enums/filter-popover.action';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit {
  filterAction = FilterPopoverAction;
  currentFilter: string;

  constructor(
    private popoverController: PopoverController,
    navParams: NavParams,
  ) {
    this.currentFilter = navParams.get('currentFilter');
  }

  ngOnInit() {
  }

  async clickedOption(option: string) {
    this.currentFilter = option;
    await this.popoverController.dismiss(option);
  }
}
