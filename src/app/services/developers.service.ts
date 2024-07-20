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

  getDevelopers(): Observable<PaginatedResponse<Developer>> {
    return this.httpClient.get<PaginatedResponse<Developer>>(`${this.gatewayUrl}/rest/developers`);
  }
}
