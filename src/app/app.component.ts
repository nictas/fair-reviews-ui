import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalMessageService } from './services/global-message.service';
import { UserInfoService } from './services/user-info.service';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isUserAuthenticated = false;
  user: string | undefined;
  userRole: 'Administrator' | 'User' | undefined;

  constructor(
    private router: Router,
    private globalMessageService: GlobalMessageService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
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
