import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Developer } from '../model/Developer';
import { environment } from '../../environment/environment';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestReview } from '../model/PullRequestReview';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getDevelopers(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<Developer>> {
    let url = `${this.gatewayUrl}/rest/developers?page=${page}&size=${size}&sort=${sort},${direction}`;
    if (sort !== 'login') {
      url += '&sort=login,asc';
    }
    return this.httpClient.get<PaginatedResponse<Developer>>(url);
  }

  deleteDeveloper(login: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.gatewayUrl}/rest/developers/${login}`);
  }

  getDeveloper(login: string): Observable<Developer> {
    return this.httpClient.get<Developer>(`${this.gatewayUrl}/rest/developers/${login}`);
  }

  getDeveloperHistory(login: string, page: number, size: number): Observable<PaginatedResponse<PullRequestReview>> {
    return this.httpClient.get<PaginatedResponse<PullRequestReview>>(`${this.gatewayUrl}/rest/developers/${login}/history?page=${page}&size=${size}&sort=createdAt,desc`);
  }

}
