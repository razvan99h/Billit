import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MorePageRoutingModule } from './more-routing.module';

import { MorePage } from './more.page';
import { BillsPageRoutingModule } from '../bills/bills-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MorePageRoutingModule,
        BillsPageRoutingModule
    ],
  declarations: [MorePage]
})
export class MorePageModule {}
