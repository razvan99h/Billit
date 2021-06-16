import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERROR_EMAIL, ERROR_PASSWORD, PASSWORD_REGEX } from '../../../shared/services/constants';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss', './../auth.styles.scss'],
})
export class LoginPage implements OnInit {
  readonly ERROR_EMAIL = ERROR_EMAIL;
  readonly ERROR_PASSWORD = ERROR_PASSWORD;
  form: FormGroup;
  showErrors = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private router: Router,
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

  login() {
    if (!this.form.valid) {
      this.showErrors = true;
      return;
    }
    this.authService
      .login({
        email: this.form.value.email,
        password: this.form.value.password
      })
      .subscribe(() => {
        this.router.navigateByUrl('');
      }, () => this.toastService.presentErrorToast('Login failed!'));
  }
}
