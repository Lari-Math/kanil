import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { User } from '../../interface/user';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private accounts: User[] = [
    {
      name: 'Nozes',
      surname: '<3',
      birth: new Date('2022-11-14'),
      username: 'larica@math.com',
      password: '1234'
    },
  ];

  constructor(private userService: UserService) {}

  authenticateUser(loginForm: FormGroup): Observable<any> {
    const username = loginForm.get('username')?.value;
    const password = loginForm.get('password')?.value;

    const authenticatedAccount = this.accounts.find(
      (account) => account.username === username && account.password === password
    );

    if (authenticatedAccount) {
      this.userService.setCurrentUser(authenticatedAccount);
      return of(authenticatedAccount);
    } else {
      return of({ error: 'Sai daqui hacker' });
    }
  }

  createAccount(createAccountForm: FormGroup): Observable<any> {
    const newUser: User = {
      name: createAccountForm.get('name')?.value,
      surname: createAccountForm.get('surname')?.value,
      birth: createAccountForm.get('birth')?.value,
      username: createAccountForm.get('newUsername')?.value,
      password: createAccountForm.get('newPassword')?.value,
    };

    const usernameTaken = this.accounts.some(account => account.username === newUser.username);
    if (usernameTaken) {
      return of({ error: 'Seja menas, kerida' });
    }
    this.accounts.push(newUser);
    this.userService.setCurrentUser(newUser);
    return of(newUser);
  }
}
