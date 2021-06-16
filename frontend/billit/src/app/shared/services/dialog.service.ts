import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private alertController: AlertController,
  ) {
  }

  async presentDeleteDialog(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Confirm deleting bill',
      message: 'Are you sure you want to delete this bill?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          role: 'confirm',
        }]
    });
    await alert.present();
    const {role} = await alert.onDidDismiss();

    return role === 'confirm';
  }
}
