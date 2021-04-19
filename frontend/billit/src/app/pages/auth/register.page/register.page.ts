import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ERROR_COUNTRY, ERROR_EMAIL, ERROR_NAME, ERROR_PASSWORD, ERROR_PASSWORD_MATCH, PASSWORD_REGEX } from '../../../services/constants';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss', './../auth.styles.scss'],
})
export class RegisterPage implements OnInit {
  readonly ERROR_EMAIL = ERROR_EMAIL;
  readonly ERROR_PASSWORD = ERROR_PASSWORD;
  readonly ERROR_PASSWORD_MATCH = ERROR_PASSWORD_MATCH;
  readonly ERROR_NAME = ERROR_NAME;
  readonly ERROR_COUNTRY = ERROR_COUNTRY;
  form: FormGroup;
  showErrors = false;
  showPasswords = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {
    this.form = this.formBuilder.group({
      email: [
        null, [
          Validators.required,
          Validators.email,
        ]
      ],
      password: [
        null, [
          Validators.required,
          Validators.pattern(PASSWORD_REGEX),
        ]
      ],
      confirmPassword: [
        null, [
          Validators.required,
          this.passwordsMatch()
        ]
      ],
      name: [
        null, [Validators.required]
      ],
      country: [
        null, [Validators.required]
      ],
    });
  }

  ngOnInit() {
  }

  toggleShowPassword() {
    this.showPasswords = !this.showPasswords;
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Register failed!',
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }

  register() {
    if (!this.form.valid) {
      this.showErrors = true;
      return;
    }
    this.authService
      .register({
        email: this.form.value.email,
        password: this.form.value.password,
        name: this.form.value.name,
        country: this.form.value.country,
      })
      .subscribe(() => {
        console.log('SUCCESS REGISTER!'); // TODO: remove and reroute to homepage
      }, () => this.presentErrorToast());
  }

  private passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.form?.value.password === control.value ? null : {forbiddenName: {value: control.value}};
    };
  }
}
