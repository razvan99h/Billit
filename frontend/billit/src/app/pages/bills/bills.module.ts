import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillsPageRoutingModule } from './bills-routing.module';

import { BillsPage } from './bills.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillsPageRoutingModule
  ],
  declarations: [BillsPage],
  providers: [
    BarcodeScanner,
  ]
})
export class BillsPageModule {}
