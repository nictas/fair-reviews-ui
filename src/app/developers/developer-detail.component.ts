import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestReview } from '../model/PullRequestReview';
import { DevelopersService } from '../services/developers.service';
import { ReviewsService } from '../services/reviews.service';
import { UserInfoService } from '../services/user-info.service';
import { mergeUnique } from '../shared/merge';

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
  entityToDelete: 'developer' | 'review' | null = null;
  entityToDeleteId: string | null = null;
  showConfirmDialog = false;

  constructor(
    private userInfoService: UserInfoService,
    private developersService: DevelopersService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userInfoService.isUserAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        this.isAdmin = isAdmin;
      }
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

  private vizualizePage(page: PaginatedResponse<PullRequestReview> | null): void {
    if (page) {
      this.reviews = mergeUnique(this.reviews, page.content, review => review.id);
      this.totalPages = page.totalPages;
      this.currentPage = page.number;
    }
  }

  fetchPage(login: string, page: number, pageSize: number): Observable<PaginatedResponse<PullRequestReview> | null> {
    this.dataLoading = true;
    return this.developersService.getDeveloperHistory(login, page, pageSize, this.sortField, this.sortDirection).pipe(
      // delay(2000), // Uncomment to test the loading indicator
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
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/developers']);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  confirmDelete(type: 'developer' | 'review', id: string): void {
    this.entityToDelete = type;
    this.entityToDeleteId = id;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.entityToDeleteId = null;
    this.entityToDelete = null;
  }

  deleteEntity(): void {
    if (this.entityToDelete === 'review') {
      this.deleteReview();
    }
    if (this.entityToDelete === 'developer') {
      this.deleteDeveloper();
    }
  }

  private deleteReview() {
    if (this.entityToDeleteId) {
      this.reviewsService.deleteReview(this.entityToDeleteId).subscribe(success => {
        this.showConfirmDialog = false;
        this.entityToDeleteId = null;
        this.entityToDelete = null;
        if (success) {
          this.developersService.getDeveloper(this.login).subscribe(developer => {
            this.developer = developer; // Refresh the developer score
          });
          this.refreshOpenPages();
        }
      });
    }
  }

  deleteDeveloper() {
    if (this.entityToDeleteId) {
      this.developersService.deleteDeveloper(this.entityToDeleteId).subscribe(success => {
        this.showConfirmDialog = false;
        this.entityToDeleteId = null;
        this.entityToDelete = null;
        if (success) {
          this.goBack();
        }
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
    this.refreshOpenPages();
  }

  private refreshOpenPages() {
    this.fetchPage(this.login, 0, (this.currentPage + 1) * this.pageSize).subscribe(page => {
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

}
