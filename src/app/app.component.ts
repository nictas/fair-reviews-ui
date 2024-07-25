import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from './model/UserInfo';
import { UserInfoService } from './services/user-info.service';
import { catchError, of } from 'rxjs';
import { MessageBaseComponent } from './shared/message-base.component';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends MessageBaseComponent implements OnInit {
  isUserAuthenticated = false;
  user: string | undefined;
  userRole: 'Administrator' | 'User' | undefined;

  constructor(private userInfoService: UserInfoService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().pipe(
      catchError(error => {
        if (error.status === 401) {
          console.log('Redirecting to /login-github');
          this.router.navigate(['/login-github']);
        } else {
          // Not using this.showFailureMessage() to keep the message on the screen until the page is refreshed.
          this.message = `An error occurred while communicating with the server. Refreshing this page might help. Error details: ${error.message}`;
          this.messageType = 'failure';
        }
        return of(null);
      })
    ).subscribe(userInfo => {
      if (userInfo) {
        this.isUserAuthenticated = true;
        this.user = userInfo.login;
        this.userRole = userInfo.roles.includes('ROLE_ADMIN') ? 'Administrator' : 'User';
      }
    });
  }

  logout() {
    this.userInfoService.logout().subscribe(() => {
      this.isUserAuthenticated = false;
      this.router.navigate(['/login-github']);
    });
  }
}
