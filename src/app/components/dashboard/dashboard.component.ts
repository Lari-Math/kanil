import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interface/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  currentUser: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  logout(){
    this.userService.logout();
  }

}
