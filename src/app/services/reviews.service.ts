import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestAssignRequest } from '../model/PullRequestAssignRequest';
import { PullRequestReview } from '../model/PullRequestReview';
import { BaseService } from './base.service';
import { GlobalMessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService extends BaseService {

  constructor(
    router: Router,
    client: HttpClient,
    globalMessageService: GlobalMessageService
  ) {
    super(router, client, globalMessageService);
  }

  getReviews(page: number, size: number, sort: string, direction: string): Observable<PaginatedResponse<PullRequestReview> | null> {
    let url = `${this.gatewayUrl}/rest/reviews?page=${page}&size=${size}&sort=${sort},${direction}&sort=id,asc`;
    return this.request(client => client.get<PaginatedResponse<PullRequestReview>>(url));
  }

  deleteReview(id: string): Observable<true | null> {
    return this.request(client => client.delete<void>(`${this.gatewayUrl}/rest/reviews/${id}`).pipe(
      map(unused => true)
    ));
  }

  getReview(id: string): Observable<PullRequestReview | null> {
    return this.request(client => client.get<PullRequestReview>(`${this.gatewayUrl}/rest/reviews/${id}`));
  }

  createReview(request: PullRequestAssignRequest): Observable<PullRequestReview[] | null> {
    return this.request(client => client.post<PullRequestReview[]>(`${this.gatewayUrl}/rest/reviews/assign`, request));
  }

}
