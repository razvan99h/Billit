import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PASSWORD_REGEX } from '../../services/contants';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form: FormGroup;
  showErrors = false;
  showPassword = false;

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
      ]
    });
  }

  ngOnInit() {
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Login failed!',
      color: 'danger',
      duration: 2000
    });
    await toast.present();
  }


  login() {
    if (!this.form.valid) {
      this.showErrors = true;
      return;
    }
    this.authService
      .login(this.form.value.email, this.form.value.password)
      .subscribe(() => {
        console.log('SUCCESS!'); // TODO: remove and reroute to homepage
      }, () => this.presentErrorToast());
  }
}
