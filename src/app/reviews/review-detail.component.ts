import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, tap } from 'rxjs';
import { ChangedFile, PullRequestReview } from '../model/PullRequestReview';
import { ReviewsService } from '../services/reviews.service';

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

  private _filter = '';
  get filter(): string {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
    this.updateShown();
  }

  constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const reviewId = this.route.snapshot.paramMap.get('id');
    if (reviewId) {
      this.dataLoading = true;
      this.reviewsService.getReview(reviewId).pipe(
        delay(2000), // Uncomment to test the loading indicator
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
        tap(data => {
          this.dataLoading = false;
        })
      ).subscribe(review => {
        this.review = review;
        this.changedFiles = review.pullRequestFileDetails.changedFiles;
        this.updateShown();
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
    this.location.back();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  getRatioWidth(value: number, otherValue: number): number {
    const total = value + otherValue;
    if (total === 0) return 0;
    return (value / total) * 100;
  }

}
