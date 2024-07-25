import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserInfo } from '../model/UserInfo';
import { BaseService } from './base.service';
import { GlobalMessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends BaseService {

  constructor(
    router: Router,
    client: HttpClient,
    globalMessageService: GlobalMessageService
  ) {
    super(router, client, globalMessageService);
  }

  getUserInfo(): Observable<UserInfo | null> {
    return this.request(client => client.get<UserInfo>(`/rest/user-info`));
  }

  isUserAdmin(): Observable<boolean | null> {
    return this.getUserInfo().pipe(
      map(userInfo => userInfo ? userInfo.roles.includes("ROLE_ADMIN") : null)
    );
  }

}
