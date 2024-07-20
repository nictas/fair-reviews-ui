import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Developer } from '../model/Developer';
import { environment } from '../../environment/environment';
import { PaginatedResponse } from '../model/PaginatedResponse';

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
}
