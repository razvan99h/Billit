import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BillsPage } from './bills.page';
import { AddBillComponent } from './add-bill/add-bill.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: BillsPage,
  },
  {
    path: 'add',
    component: AddBillComponent
  }
];

@NgModule({
  declarations: [AddBillComponent],
  imports: [RouterModule.forChild(routes), IonicModule, FormsModule, CommonModule],
  exports: [RouterModule],
})
export class BillsPageRoutingModule {
}
