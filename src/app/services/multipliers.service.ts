import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Multiplier } from '../model/Multiplier';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { BaseService } from './base.service';
import { GlobalMessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class MultipliersService extends BaseService {

  constructor(
    router: Router,
    client: HttpClient,
    globalMessageService: GlobalMessageService
  ) {
    super(router, client, globalMessageService);
  }

  getMultipliers(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<Multiplier> | null> {
    let url = `${this.gatewayUrl}/rest/multipliers?page=${page}&size=${size}&sort=${sort},${direction}&sort=id,asc`;
    return this.request(client => client.get<PaginatedResponse<Multiplier>>(url));
  }

  deleteMultiplier(id: string): Observable<true | null> {
    return this.request(client => client.delete<void>(`${this.gatewayUrl}/rest/multipliers/${id}`).pipe(
      map(unused => true)
    ));
  }

  getMultiplier(id: string): Observable<Multiplier | null> {
    return this.request(client => client.get<Multiplier>(`${this.gatewayUrl}/rest/multipliers/${id}`));
  }

  createMultiplier(multiplier: Multiplier): Observable<Multiplier | null> {
    return this.request(client => client.post<Multiplier>(`${this.gatewayUrl}/rest/multipliers`, multiplier));
  }

  applyLatestMultiplier(): Observable<true | null> {
    return this.request(client => client.post<void>(`${this.gatewayUrl}/rest/multipliers/latest/apply`, {}).pipe(
      map(unused => true)
    ));
  }

}
