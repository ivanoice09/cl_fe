import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPwdCredentials } from '../../../shared/models/ResetPwdCredentials';
import { ResetPasswordHttp } from '../../../shared/services/reset-password-http';
import { AuthService } from '../../../shared/services/auth-service';
import { HttpStatusCode } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  submitted = false;
  email: string = "";
  password: string = "";
  showPassword = false;
  showPopover = false;
  ruleLetter = false;
  ruleNumber = false;
  ruleLength = false;
  emailNonExistent = false;
  passwordInvalid: boolean = false;
  passwordMismatch: boolean = false;

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: ResetPasswordHttp,
    private router: Router, 
    private alertService: AlertService
  ) { }

  resetPasswordBackend() {
    this.submitted = true;
    this.checkPasswordRules();
    this.matchPassword();

    if (this.passwordInvalid || this.passwordMismatch || this.resetPasswordForm.invalid) {
      return;
    }

    const email = this.resetPasswordForm.value.email!;
    const newPassword = this.resetPasswordForm.value.password!;

    this.http.HttpPostResetPwd({ email, newPassword }).subscribe({

      next: (response) => {
        switch (response.status) {

          case HttpStatusCode.Ok:
            this.alertService.showAlert('Password reset successful', 'success');
            console.log('Password reset successful');
            this.router.navigate(['/login']);
            break;

          default:
            console.error('Password reset failed with status:', response.status);
            break;

        }
      },
      error: (err) => {
        // console.error('Password reset failed with status:', err);
        if (err.status === 401) {
          this.emailNonExistent = true;
          return;
        }
      },

    });

  }

  //------------------
  // Useful functions:
  //------------------

  checkPasswordRules(): boolean {
    const pass = this.resetPasswordForm.get('password')?.value || '';

    // Show popover only when typing
    this.showPopover = pass.length > 0;

    this.ruleLetter = /[A-Za-z]/.test(pass);
    this.ruleNumber = /\d/.test(pass);
    this.ruleLength = pass.length >= 8;

    // final validation flag for submission
    this.passwordInvalid = !(this.ruleLetter && this.ruleNumber && this.ruleLength);

    return this.passwordInvalid;
  }

  matchPassword(): boolean {
    this.passwordMismatch = this.resetPasswordForm.get('password')?.value !==
      this.resetPasswordForm.get('confirmPassword')?.value;
    return !this.passwordMismatch;
  }

  clearErrors() {
    if (this.submitted) {
      this.submitted = false;
      this.passwordInvalid = false;
      this.passwordMismatch = false;
    }
  }

  ngOnInit() {
    const savedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (savedEmail) {
      // console.log("Email che verrà passato al login:", savedEmail);
      this.resetPasswordForm.patchValue({
        email: savedEmail
      });
    }
  }

  cancelReset() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
