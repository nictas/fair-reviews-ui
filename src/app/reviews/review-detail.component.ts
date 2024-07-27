import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, tap } from 'rxjs';
import { ChangedFile, PullRequestReview } from '../model/PullRequestReview';
import { ReviewsService } from '../services/reviews.service';
import { UserInfoService } from '../services/user-info.service';

@Component({
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.css']
})
export class ReviewDetailComponent implements OnInit {

  review: PullRequestReview | null = null;
  changedFiles: ChangedFile[] = [];
  shownChangedFiles: ChangedFile[] = [];
  dataLoading = true;
  isCollapsed = false;
  showConfirmDialog = false;
  reviewToDelete: string | null = null;
  isAdmin = false;

  private _filter = '';
  get filter(): string {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
    this.updateShown();
  }

  constructor(
    private userInfoService: UserInfoService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (reviewId) {
      this.dataLoading = true;
      this.userInfoService.isUserAdmin().subscribe(isAdmin => {
        if (isAdmin) {
          this.isAdmin = isAdmin;
        }
      });
      this.reviewsService.getReview(reviewId).pipe(
        // delay(2000), // Uncomment to test the loading indicator
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
        tap(data => {
          this.dataLoading = false;
        })
      ).subscribe(review => {
        if (review) {
          this.review = review;
          this.changedFiles = review.pullRequestFileDetails.changedFiles;
          this.updateShown();
        }
      });
    }
  }

  updateShown(): void {
    let filter = this.filter.toLowerCase();
    this.shownChangedFiles = this.changedFiles.filter(changedFile => {
      let name = changedFile.name.toLowerCase();
      return name.includes(filter);
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/reviews']);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getRatioWidth(value: number | undefined, otherValue: number | undefined): number {
    if (value && otherValue) {
      const total = value + otherValue;
      if (total === 0) return 0;
      return (value / total) * 100;
    }
    return 0;
  }

  confirmDelete(id: string | null): void {
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
          this.goBack();
        }
      });
    }
  }

}
