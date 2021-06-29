import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { SharedService } from '../../../shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERROR_COUNTRY, ERROR_EMAIL, ERROR_NAME, ERROR_PASSWORD, PASSWORD_REGEX } from 'src/app/shared/services/constants';
import { UsersService } from '../../../shared/services/users.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Currencies } from '../../../shared/models/enums/currencies';
import { User } from '../../../shared/models/user.model';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  readonly ERROR_EMAIL = ERROR_EMAIL;
  readonly ERROR_NAME = ERROR_NAME;
  readonly ERROR_COUNTRY = ERROR_COUNTRY;
  isEditMode = false;
  form: FormGroup;
  showErrors = false;
  currency: string;
  currencies = Object.values(Currencies);
  private user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private userService: UsersService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private loadingController: LoadingController,
  ) {
    this.form = this.formBuilder.group({
      email: [
        null, [
          Validators.required,
          Validators.email,
        ]
      ],
      name: [
        null, [Validators.required]
      ],
      country: [
        null, [Validators.required]
      ],
    });

    this.fetchUserDetails();
  }

  fetchUserDetails() {
    const userId = this.localStorageService.loginData._id;
    this.userService
      .getUserDetails(userId)
      .subscribe((user) => {
        this.user = user;
        this.initialiseForm();
        this.currency = user.currency;
      });
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['./..'], {relativeTo: this.route});
  }

  async exitEditMode() {
    const alert = await this.alertController.create({
      header: 'Confirm exiting form',
      message: 'Are you sure you want to leave this form?',
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

    if (role === 'confirm') {
      this.initialiseForm();
      this.disableEditMode();
    }
  }

  disableEditMode() {
    this.isEditMode = false;
    this.sharedService.sendMyAccountEditCall(false);
  }

  enableEditMode() {
    this.isEditMode = true;
    this.sharedService.sendMyAccountEditCall(true);
  }

  async save() {
    this.showErrors = true;
    if (!this.form.valid) {
      return;
    }
    const loading = await this.loadingController.create({});
    await loading.present();

    this.userService
      .editUser(new User(
        this.user._id,
        this.form.value.name,
        this.form.value.email,
        this.form.value.country,
        this.currency
      ))
      .subscribe(async () => {
        if (this.currency !== this.localStorageService.loginData.currency) {
          this.localStorageService.loginData = {...this.localStorageService.loginData, currency: this.currency};
        }
        await this.toastService.presentSuccessToast('Account details modified!');
        await loading.dismiss();
        this.disableEditMode();
        window.location.reload();
      }, async () => {
        await this.toastService.presentErrorToast('Could not edit account details!');
      });
  }

  async changePassword() {
    const alert = await this.alertController.create({
      cssClass: 'billit-password-alert',
      header: 'Change password',
      message: `The new ${ERROR_PASSWORD}. <br><br> It also must be different than the current password.`,
      inputs: [
        {
          placeholder: 'Current password',
          name: 'currentPassword',
          type: 'password',
        },
        {
          placeholder: 'New password',
          name: 'newPassword',
          type: 'password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Save',
          handler: (alertData) => {
            const oldPassword = alertData.currentPassword;
            const newPassword = alertData.newPassword;
            if (oldPassword === newPassword) {
              this.toastService.presentErrorToast('New password cannot be the same as the current password!');
              return false;
            }
            if (!new RegExp(PASSWORD_REGEX).test(newPassword)) {
              this.toastService.presentErrorToast(ERROR_PASSWORD);
              return false;
            }
            this.userService
              .changePassword({
                userId: this.user._id,
                oldPassword,
                newPassword
              })
              .subscribe(
                () => {
                  this.toastService.presentSuccessToast('Password successfully changed!');
                  alert.dismiss();
                }, (error) => {
                  if (error.status === 405) {
                    this.toastService.presentErrorToast('Old password is incorrect');
                  } else {
                    this.toastService.presentErrorToast('Could not change password!');
                  }
                });
            return false;
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirm deleting account',
      message: 'Are you sure you want to permanently delete your account? <br><br> <strong>This action cannot be undone!</strong>',
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

    if (role === 'confirm') {
      const loading = await this.loadingController.create({});
      await loading.present();
      this.userService
        .deleteUser(this.user._id)
        .subscribe(async () => {
          await loading.dismiss();
          this.authService.logout();
          window.location.reload();
        }, async () => {
          await loading.dismiss();
          await this.toastService.presentErrorToast('Could not delete account!');
        });
    }
  }

  private initialiseForm() {
    this.form.controls.name.setValue(this.user.name);
    this.form.controls.email.setValue(this.user.email);
    this.form.controls.country.setValue(this.user.country);
  }
}
