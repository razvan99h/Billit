import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
  ERROR_COUNTRY,
  ERROR_EMAIL,
  ERROR_NAME,
  ERROR_PASSWORD,
  ERROR_PASSWORD_MATCH,
  PASSWORD_REGEX
} from '../../../shared/services/constants';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/services/toast.service';

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
      .subscribe(async () => {
        await this.toastService.presentSuccessToast('Account created! Please login now');
        this.router.navigateByUrl('/auth/login');
      }, () => this.toastService.presentErrorToast('Account creation failed!'));
  }

  toggleShowPassword() {
    this.showPasswords = !this.showPasswords;
  }

  private passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return this.form?.value.password === control.value ? null : {forbiddenName: {value: control.value}};
    };
  }
}
