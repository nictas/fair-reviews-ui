import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, Observable, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PullRequestReview } from '../model/PullRequestReview';
import { DevelopersService } from '../services/developers.service';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { UserInfoService } from '../services/user-info.service';
import { ReviewsService } from '../services/reviews.service';

@Component({
  templateUrl: './developer-detail.component.html',
  styleUrls: ['./developer-detail.component.css']
})
export class DeveloperDetailComponent implements OnInit {

  isAdmin = false;
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
  sortField = 'createdAt';
  sortDirection = 'desc';

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
  reviewToDelete: string | null = null;
  showConfirmDialog = false;


  constructor(
    private userInfoService: UserInfoService,
    private developersService: DevelopersService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      this.isAdmin = userInfo.roles.includes('ROLE_ADMIN');
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
    });
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
    return this.developersService.getDeveloperHistory(login, page, pageSize, this.sortField, this.sortDirection).pipe(
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

  confirmDelete(id: string): void {
    this.reviewToDelete = id;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.reviewToDelete = null;
  }

  deleteMultiplier(): void {
    if (this.reviewToDelete) {
      this.reviewsService.deleteReview(this.reviewToDelete).subscribe(() => {
        this.reviews = this.reviews.filter(review => review.id !== this.reviewToDelete);
        this.showConfirmDialog = false;
        this.reviewToDelete = null;
      });
    }
  }

  onSortChange(field: string): void {
    if (this.dataLoading) {
      return;
    }
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';  // Reset to ascending if a new field is clicked
    }
    this.fetchPage(this.login, 0, (this.currentPage + 1) * this.pageSize).subscribe(page => {
      this.reviews = page.content;
    });
  }

  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    }
    return '';
  }

}
