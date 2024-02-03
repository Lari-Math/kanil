import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

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
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
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
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  onCreateAccountSubmit() {
    if (this.createAccountForm.errors) {
      console.log(this.createAccountForm.errors)
      return;
    }

    this.authService
      .createAccount(this.createAccountForm)
      .subscribe((result) => {
        if (result.error) {
          console.error(result.error);
          return
        } else {
          console.log(result);
          this.router.navigate(['/dashboard']);
        }
      });
  }

}
