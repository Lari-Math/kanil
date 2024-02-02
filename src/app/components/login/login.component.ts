import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  createAccountForm!: FormGroup;

  showLoginForm: boolean = true;
  showCreateAccountForm: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.createAccountForm = this.fb.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        birth: ['', Validators.required],
        newUsername: ['', [Validators.required, Validators.email]],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordsNotMatch: true };
  }

  toggleForms() {
    this.showLoginForm = !this.showLoginForm;
    this.showCreateAccountForm = !this.showCreateAccountForm;
  }

  onLoginSubmit() {
    {
      this.authService.authenticateUser(this.loginForm).subscribe((result) => {
        if (result.error) {
          console.error(result.error);
        } else {
          console.log(result);
        }
      });
    }
  }

  onCreateAccountSubmit() {
    this.authService
      .createAccount(this.createAccountForm)
      .subscribe((result) => {
        if (result.error) {
          console.error(result.error);
        } else {
          //console.log(result);
        }
      });
    console.log('Create account form submitted');

    const { newUsername, newPassword } = this.createAccountForm.value;
    const loginCredentials = this.fb.group({
      username: [newUsername, Validators.required],
      password: [newPassword, Validators.required],
    });

    this.authService
      .authenticateUser(loginCredentials)
      .subscribe((loginResult) => {
        if (loginResult.error) {
          console.error(loginResult.error);
        } else {
          console.log('Login bem sucedido após criar conta:', loginResult);
        }
      });
  }
}
