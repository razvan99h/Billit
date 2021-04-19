import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginPage } from './login.page/login.page';
import { RegisterPage } from './register.page/register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginPage,
    RegisterPage,
  ]
})
export class AuthModule {}
