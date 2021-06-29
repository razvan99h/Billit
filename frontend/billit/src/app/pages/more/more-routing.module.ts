import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MorePage } from './more.page';
import { FAQComponent } from './faq/faq.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MyAccountComponent } from './my-account/my-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MorePage
  },
  {
    path: 'faq',
    component: FAQComponent
  },
  {
    path: 'account',
    component: MyAccountComponent
  },
];

@NgModule({
  declarations: [FAQComponent, MyAccountComponent],
  imports: [RouterModule.forChild(routes), IonicModule, CommonModule, ReactiveFormsModule, FormsModule],
  exports: [RouterModule],
})
export class MorePageRoutingModule {
}
