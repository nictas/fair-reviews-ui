import { Component, OnInit } from '@angular/core';
import { UserInfoService } from './services/user-info.service';
import { UserInfo } from './model/UserInfo';
import { NavigationStart, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fair-reviews-ui';
  isUserAuthenticated = false;
  userLogin: string | undefined;
  userRole: string = 'User'; // Default role
  redirectUrl = '/developers';

  constructor(private userInfoService: UserInfoService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.redirectUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(
      (userInfo: UserInfo) => {
        // If successful, store user info and redirect to /developers
        this.isUserAuthenticated = true;
        this.userLogin = userInfo.login;
        this.userRole = userInfo.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'User';
        this.router.navigate([this.redirectUrl]);
      },
      (error: HttpErrorResponse) => {
        console.log('An error occurred:', error);
        if (error.status === 401) {
          // If 401, redirect to /login-github
          console.log('Redirecting to /login-github');
          this.router.navigate(['/login-github']);
        } else {
          // Handle other errors or log them if necessary
          console.error('An error occurred:', error);
        }
      }
    );
  }

  logout() {
    this.userInfoService.logout().subscribe(() => {
      this.isUserAuthenticated = false;
      this.router.navigate(['/login-github']);
    });
  }
}
