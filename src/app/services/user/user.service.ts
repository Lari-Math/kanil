import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interface/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {}

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  logout(): void{
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
