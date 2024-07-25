import { Component, OnInit } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestReview } from '../model/PullRequestReview';
import { GlobalMessageService } from '../services/global-message.service';
import { ReviewsService } from '../services/reviews.service';
import { UserInfoService } from '../services/user-info.service';
import { mergeUnique } from '../shared/merge';

@Component({
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  get pageTitle() {
    return 'Pull Request Reviews';
  }

  get pageSize() {
    return 5;
  }

  private _reviewsFilter = '';

  get reviewsFilter(): string {
    return this._reviewsFilter;
  }

  set reviewsFilter(filter: string) {
    this._reviewsFilter = filter;
    this.updateShownReviews();
  }

  private _reviews: PullRequestReview[] = [];

  get reviews(): PullRequestReview[] {
    return this._reviews;
  }

  set reviews(reviews: PullRequestReview[]) {
    this._reviews = reviews;
    this.updateShownReviews();
  }

  shownReviews: PullRequestReview[] = [];
  reviewsLoading = true;

  currentPage = 0;
  totalPages = 0;
  sortField = 'createdAt';
  sortDirection = 'desc';
  isAdmin = false;
  showConfirmDialog = false;
  reviewToDelete: string | null = null;
  addFormVisible = false;

  constructor(
    private globalMessageService: GlobalMessageService,
    private userInfoService: UserInfoService,
    private reviewsService: ReviewsService
  ) { }

  ngOnInit(): void {
    this.userInfoService.isUserAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        this.isAdmin = isAdmin;
      }
      this.fetchPage(this.currentPage, this.pageSize).subscribe(page => this.vizualizePage(page));
    });
  }

  private fetchPage(page: number, pageSize: number): Observable<PaginatedResponse<PullRequestReview> | null> {
    this.reviewsLoading = true;
    return this.reviewsService.getReviews(page, pageSize, this.sortField, this.sortDirection).pipe(
      delay(2000), // Uncomment to test the loading indicator
      tap(page => console.log(`Fetched reviews page: ${JSON.stringify(page)}`)),
      tap(page => this.reviewsLoading = false)
    );
  }

  private vizualizePage(page: PaginatedResponse<PullRequestReview> | null): void {
    if (page) {
      this.reviews = mergeUnique(this.reviews, page.content, review => review.id);
      this.totalPages = page.totalPages;
      this.currentPage = page.number;
    }
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchPage(this.currentPage + 1, this.pageSize).subscribe(page => this.vizualizePage(page));
    }
  }

  onSortChange(field: string): void {
    if (this.reviewsLoading) {
      return;
    }
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';  // Reset to ascending if a new field is clicked
    }
    this.refreshOpenPages();
  }

  private refreshOpenPages() {
    this.fetchPage(0, (this.currentPage + 1) * this.pageSize).subscribe(page => {
      if (page) {
        this.reviews = page.content;
      }
    });
  }

  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    }
    return '';
  }

  confirmDelete(id: string): void {
    this.reviewToDelete = id;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.reviewToDelete = null;
  }

  deleteReview(): void {
    if (this.reviewToDelete) {
      this.reviewsService.deleteReview(this.reviewToDelete).subscribe(success => {
        this.showConfirmDialog = false;
        this.reviewToDelete = null;
        if (success) {
          this.refreshOpenPages();
        }
      });
    }
  }

  updateShownReviews(): void {
    let filter = this.reviewsFilter.toLowerCase();
    this.shownReviews = this.reviews.filter(review => {
      let id = review.id.toLowerCase();
      let multiplierId = review.multiplier.id.toLowerCase();
      let url = review.pullRequestUrl.toLowerCase();
      let developerLogin = review.developer.login.toLowerCase();
      return id.includes(filter) || multiplierId.includes(filter) || url.includes(filter) || developerLogin.includes(filter);
    });
  }

  showAddForm(): void {
    this.addFormVisible = true;
  }

  hideAddForm(reviews: PullRequestReview[] | null): void {
    this.addFormVisible = false;
    console.log(`Received reviews ${JSON.stringify(reviews)}`);
    if (reviews && reviews.length > 0) {
      const assignees = reviews.map(review => review.developer.login).join(', ');
      this.globalMessageService.showSuccessMessage(`Pull request has been assigned to ${assignees}, granting them an additional score of ${reviews[0].score}.`, 20000);
      this.refreshOpenPages();
    }
  }

}
