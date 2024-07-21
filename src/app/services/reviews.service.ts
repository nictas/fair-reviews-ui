import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestReview } from '../model/PullRequestReview';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private gatewayUrl = environment.gatewayUrl;

  constructor(private httpClient: HttpClient) { }

  getReviews(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<PullRequestReview>> {
    let url = `${this.gatewayUrl}/rest/reviews?page=${page}&size=${size}&sort=${sort},${direction}&sort=id,asc`;
    return this.httpClient.get<PaginatedResponse<PullRequestReview>>(url);
  }

  deleteReview(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.gatewayUrl}/rest/reviews/${id}`);
  }
}
