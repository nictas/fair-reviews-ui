import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserInfo } from './IUserInfo';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getUserInfo(): Observable<IUserInfo[]> {
    return this.httpClient.get<IUserInfo[]>(`${this.gatewayUrl}/rest/user-info`);
  }

}
