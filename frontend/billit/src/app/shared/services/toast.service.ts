import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController,
  ) {
  }

  async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }
}
