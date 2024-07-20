import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfo } from '../model/UserInfo';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<UserInfo> {
    return this.httpClient.get<UserInfo>(`${this.gatewayUrl}/rest/user-info`);
  }

}
