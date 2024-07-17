import { Component, OnInit } from '@angular/core';
import { UserInfoService } from './user-info.service';
import { IUserInfo } from './IUserInfo';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'fair-reviews-ui';
  isUserAuthenticated = false;

  constructor(private userInfoService: UserInfoService, private router: Router) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(
      (userInfo: IUserInfo[]) => {
        // If successful, redirect to /developers
        this.isUserAuthenticated = true;
        this.router.navigate(['/developers']);
      },
      (error: HttpErrorResponse) => {
        console.log('An error occurred:', error);
        if (error.status === 401) {
          // If 401, redirect to /login
          console.log('Redirecting to /login-github');
          this.router.navigate(['/login-github']);
        } else {
          // Handle other errors or log them if necessary
          console.error('An error occurred:', error);
        }
      }
    );
  }

}
