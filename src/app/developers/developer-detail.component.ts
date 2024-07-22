import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PullRequestReview } from '../model/PullRequestReview';
import { DevelopersService } from '../services/developers.service';

@Component({
  templateUrl: './developer-detail.component.html',
  styleUrls: ['./developer-detail.component.css']
})
export class DeveloperDetailComponent implements OnInit {

  developer: Developer | null = null;
  reviews: PullRequestReview[] = [];
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

  constructor(
    private developersService: DevelopersService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    const login = this.route.snapshot.paramMap.get('login');
    if (login) {
      this.dataLoading = true;
      this.developersService.getDeveloper(login).pipe(
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`))
      ).subscribe(developer => {
        this.developer = developer;
        this.developersService.getDeveloperHistory(login).pipe(
          delay(2000), // Uncomment to test the loading indicator
          tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
          tap(data => {
            this.dataLoading = false;
          })
        ).subscribe(reviews => {
          this.reviews = reviews.content;
          this.updateShown();
        });
      })

    }
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
