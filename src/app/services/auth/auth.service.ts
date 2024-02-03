import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/enviroment';
import { User } from '../../interface/user';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private accounts: User[] = [];

  constructor(private userService: UserService, private http: HttpClient) {

    this.loadUserAccounts();
  }

  private loadUserAccounts() {
    const jsonPath = 'assets/data/accounts.json';
    const jsonURL = `${environment.baseUrl}/${jsonPath}`;


    this.http.get<User[]>(jsonURL).subscribe(
      (data) => {
        this.accounts = data;
      },
      (error) => {
        console.error('Error carregando o arquivo de Accounts', error);
      }
    );
  }

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
      return of({ error: 'Usuário ou senha inválidos' });
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
      return of({ error: 'Nome de Usuário já utilizado' });
    }
    this.accounts.push(newUser);
    this.userService.setCurrentUser(newUser);
    return of(newUser);
  }
}
