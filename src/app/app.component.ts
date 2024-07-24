import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './model/UserInfo';
import { UserInfoService } from './services/user-info.service';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isUserAuthenticated = false;
  userLogin: string | undefined;
  userRole: 'Administrator' | 'User' | undefined;

  constructor(private userInfoService: UserInfoService, private router: Router) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(
      (userInfo: UserInfo) => {
        // If successful, store user info
        this.isUserAuthenticated = true;
        this.userLogin = userInfo.login;
        this.userRole = userInfo.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'User';
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
