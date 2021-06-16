import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillsPage } from './bills.page';
import { AddEditBillComponent } from './add-edit-bill/add-edit-bill.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { DetailsPopoverComponent } from './bill-details/details-popover/details-popover.component';
import { AppbarLogoComponent } from '../../shared/components/appbar-logo/appbar-logo.component';

const routes: Routes = [
  {
    path: '',
    component: BillsPage,
  },
  {
    path: 'add',
    component: AddEditBillComponent
  },
  {
    path: 'edit',
    component: AddEditBillComponent
  },
  {
    path: 'details',
    component: BillDetailsComponent
  }
];

@NgModule({
    declarations: [AddEditBillComponent, DetailsPopoverComponent, BillDetailsComponent, AppbarLogoComponent],
  imports: [RouterModule.forChild(routes), IonicModule, FormsModule, CommonModule],
  exports: [RouterModule, AppbarLogoComponent],
})
export class BillsPageRoutingModule {
}
