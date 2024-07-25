import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Developer } from '../model/Developer';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestReview } from '../model/PullRequestReview';
import { BaseService } from './base.service';
import { GlobalMessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService extends BaseService {

  constructor(
    router: Router,
    client: HttpClient,
    globalMessageService: GlobalMessageService
  ) {
    super(router, client, globalMessageService);
  }

  getDevelopers(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<Developer> | null> {
    let url = `${this.gatewayUrl}/rest/developers?page=${page}&size=${size}&sort=${sort},${direction}`;
    if (sort !== 'login') {
      url += '&sort=login,asc';
    }
    return this.request(client => client.get<PaginatedResponse<Developer>>(url));
  }

  deleteDeveloper(login: string): Observable<true | null> {
    return this.request(client => client.delete<void>(`${this.gatewayUrl}/rest/developers/${login}`).pipe(
      map(unused => true)
    ));
  }

  getDeveloper(login: string): Observable<Developer | null> {
    return this.request(client => client.get<Developer>(`${this.gatewayUrl}/rest/developers/${login}`));
  }

  getDeveloperHistory(login: string, page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<PullRequestReview> | null> {
    let url = `${this.gatewayUrl}/rest/developers/${login}/history?page=${page}&size=${size}&sort=${sort},${direction}`;
    if (sort !== 'id') {
      url += '&sort=id,asc';
    }
    return this.request(client => client.get<PaginatedResponse<PullRequestReview>>(url));
  }

  syncDevelopers(): Observable<true | null> {
    return this.request(client => client.post<void>(`${this.gatewayUrl}/rest/developers/sync`, {}).pipe(
      map(unused => true)
    ));
  }

}
