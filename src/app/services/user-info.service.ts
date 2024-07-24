import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { UserInfo } from '../model/UserInfo';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<UserInfo> {
    return this.httpClient.get<UserInfo>(`${this.gatewayUrl}/rest/user-info`);
  }

  isAdmin(): Observable<boolean> {
    return this.getUserInfo().pipe(map(userInfo => userInfo.roles.includes("ROLE_ADMIN")));
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(`${this.gatewayUrl}/logout`, {});
  }
}
