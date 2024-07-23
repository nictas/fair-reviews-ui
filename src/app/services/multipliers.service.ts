import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Multiplier } from '../model/Multiplier';
import { PaginatedResponse } from '../model/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class MultipliersService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getMultipliers(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<Multiplier>> {
    let url = `${this.gatewayUrl}/rest/multipliers?page=${page}&size=${size}&sort=${sort},${direction}&sort=id,asc`;
    return this.httpClient.get<PaginatedResponse<Multiplier>>(url);
  }

  deleteMultiplier(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.gatewayUrl}/rest/multipliers/${id}`);
  }

  getMultiplier(id: string): Observable<Multiplier> {
    return this.httpClient.get<Multiplier>(`${this.gatewayUrl}/rest/multipliers/${id}`);
  }

  createMultiplier(multiplier: Multiplier): Observable<Multiplier> {
    return this.httpClient.post<Multiplier>(`${this.gatewayUrl}/rest/multipliers`, multiplier);
  }

  applyLatestMultiplier(): Observable<void> {
    return this.httpClient.post<void>(`${this.gatewayUrl}/rest/multipliers/latest/apply`, {});
  }

}
