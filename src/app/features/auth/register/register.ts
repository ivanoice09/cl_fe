import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterHttp } from '../../../shared/services/register-http';
import { AuthService } from '../../../shared/services/auth-service';
import { HttpStatusCode } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { IJwtCustomPayload } from '../../../shared/models/IJwtCustomPayload';
import { AlertService } from '../../../shared/services/alert-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  submitted = false;
  showPassword = false;
  showPopover = false;
  ruleLetter = false;
  ruleNumber = false;
  ruleLength = false;
  emailAlreadyRegistered = false;
  passwordInvalid = false;

  constructor(
    private http: RegisterHttp, 
    private auth: AuthService, 
    private router: Router,
    private alertService: AlertService
  ) {}

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.minLength(2)]),
    middleName: new FormControl('', [Validators.maxLength(50), Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.minLength(10), this.phoneValidator]),
  });

  registerBackend() {
    this.submitted = true;
    this.checkPasswordRules();

    if (this.registerForm.invalid) {
      return;
    }

    const firstName = this.registerForm.value.firstName!;
    const lastName = this.registerForm.value.lastName!;
    const middleName = this.registerForm.value.middleName!;
    const email = this.registerForm.value.email!;
    const password = this.registerForm.value.password!;
    const phone = this.registerForm.value.phone!;

    this.http.HttpPostRegister({ firstName, lastName, middleName, email, password, phone }).subscribe({
      next: (response) => {
        switch (response.status) {
          case HttpStatusCode.Ok:
            const token = response.body?.token;
            const payload = jwt_decode.jwtDecode<IJwtCustomPayload>(token);
            this.auth.SetJwtInfo(true, token, payload.email);
            this.router.navigate(['/profile']);
            this.alertService.showAlert('Registered successfully', 'success')
            break;

          default:
            console.error('Registration failed:', response.status);
            break;
        }
      },
      error: (err) => {
        if (err.status === 409) {
          localStorage.setItem('userEmail', email);
          this.emailAlreadyRegistered = true;
          return;
        } 
      },

    });

  }

  //-------------------------
  // All useful functions:
  //-------------------------

  // Prevent user for entering invalid chars for firstName, lastName, middleName
  allowOnlyNameChars(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End'
    ];

    // Allow navigation & editing keys
    if (allowedKeys.includes(event.key)) return;
    // Allow Ctrl/Cmd shortcuts (copy, paste, etc.)
    if (event.ctrlKey || event.metaKey) return;
    // Letters only (Unicode)
    const regex = /^\p{L}$/u;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyPhoneChars(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End'
    ];

    if (allowedKeys.includes(event.key)) return;
    if (event.ctrlKey || event.metaKey) return;
    // Digits only
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPhonePaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(pasted)) {
      event.preventDefault();
    }
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^\d+$/.test(value) ? null : { invalidPhone: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearErrors() {
    if (this.submitted) {
      this.submitted = false;
    }
  }

  autoCapitalize(controlName: string) {
    const control = this.registerForm.get(controlName);
    if (!control) return;
    const value = control.value ?? '';
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    control.setValue(formatted, {emitEvent: false});
  }

  checkPasswordRules(): boolean {
    const pass = this.registerForm.get('password')?.value || '';
    // Show popover only when typing
    this.showPopover = pass.length > 0;
    this.ruleLetter = /[A-Za-z]/.test(pass);
    this.ruleNumber = /\d/.test(pass);
    this.ruleLength = pass.length >= 8;
    // final validation flag for submission
    this.passwordInvalid = !(this.ruleLetter && this.ruleNumber && this.ruleLength);
    return this.passwordInvalid;
  }

}
