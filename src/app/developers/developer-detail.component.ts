import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, Observable, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PullRequestReview } from '../model/PullRequestReview';
import { DevelopersService } from '../services/developers.service';
import { PaginatedResponse } from '../model/PaginatedResponse';

@Component({
  templateUrl: './developer-detail.component.html',
  styleUrls: ['./developer-detail.component.css']
})
export class DeveloperDetailComponent implements OnInit {

  login = '';
  developer: Developer | null = null;

  private _reviews: PullRequestReview[] = [];

  get reviews(): PullRequestReview[] {
    return this._reviews;
  }

  set reviews(reviews: PullRequestReview[]) {
    this._reviews = reviews;
    this.updateShown();
  }

  shownReviews: PullRequestReview[] = [];
  dataLoading = true;
  isCollapsed = false;

  private _filter = '';
  get filter(): string {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
    this.updateShown();
  }

  get pageSize() {
    return 5;
  }

  currentPage = 0;
  totalPages = 0;

  constructor(
    private developersService: DevelopersService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const loginParameter = this.route.snapshot.paramMap.get('login');
    if (loginParameter != null) {
      this.login = loginParameter;
    }
    if (this.login) {
      this.dataLoading = true;
      this.developersService.getDeveloper(this.login).pipe(
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`))
      ).subscribe(developer => {
        this.developer = developer;
        this.fetchPage(this.login, this.currentPage, this.pageSize).subscribe(page => this.vizualizePage(page));
      })
    }
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchPage(this.login, this.currentPage + 1, this.pageSize).subscribe(page => this.vizualizePage(page));
    }
  }

  private vizualizePage(page: PaginatedResponse<PullRequestReview>): void {
    this.reviews = [...this.reviews, ...page.content];
    this.totalPages = page.totalPages;
    this.currentPage = page.number;
  }

  fetchPage(login: string, page: number, pageSize: number): Observable<PaginatedResponse<PullRequestReview>> {
    this.dataLoading = true;
    return this.developersService.getDeveloperHistory(login, page, pageSize).pipe(
      delay(2000), // Uncomment to test the loading indicator
      tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
      tap(data => {
        this.dataLoading = false;
      })
    );
  }

  updateShown(): void {
    let filter = this.filter.toLowerCase();
    this.shownReviews = this.reviews.filter(review => {
      let id = review.id.toLowerCase();
      let multiplierId = review.multiplier.id.toLowerCase();
      let url = review.pullRequestUrl.toLowerCase();
      return id.includes(filter) || multiplierId.includes(filter) || url.includes(filter);
    });
  }

  goBack(): void {
    this.location.back();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
