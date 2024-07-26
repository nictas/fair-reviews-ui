import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DevelopersService } from '../services/developers.service';
import { mergeUnique } from '../shared/merge';
import { Developer } from '../model/Developer';
import { concatMap, EMPTY, expand, Observable, of, Subscription, takeWhile, tap } from 'rxjs';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { PullRequestAssignRequest } from '../model/PullRequestAssignRequest';
import { ReviewsService } from '../services/reviews.service';
import { PullRequestReview } from '../model/PullRequestReview';

@Component({
  selector: 'fr-add-review-form',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css']
})
export class AddReviewComponent implements OnInit, OnDestroy {

  @Input() show: boolean = false;
  @Output() reviews = new EventEmitter<PullRequestReview[] | null>();
  form: FormGroup;
  developerLogins: string[] = [];
  developers: Developer[] = [];
  developersSubscription: Subscription | null = null;

  get pageSize() {
    return 20;
  }

  private currentPage = 0;
  private totalPages = 0;

  constructor(
    private formBuilder: FormBuilder,
    private developersService: DevelopersService,
    private reviewsService: ReviewsService) {

    this.form = this.formBuilder.group({
      pullRequestUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      assigneeList: this.formBuilder.array([]),
      assigneeExclusionList: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.developersSubscription = this.fetchAllDeveloperPages().subscribe(
      page => console.log(`Fetched page ${page} of developers`)
    );
  }

  ngOnDestroy(): void {
    if (this.developersSubscription) {
      this.developersSubscription.unsubscribe();
    }
  }

  fetchAllDeveloperPages(): Observable<number> {
    return of(0).pipe(
      expand(page =>
        this.developersService.getDevelopers(page, this.pageSize, 'login', 'asc').pipe(
          tap(page => {
            console.log(`Fetched developers page: ${JSON.stringify(page)}`);
            if (page) {
              this.developers = mergeUnique(this.developers, page.content, developer => developer.login);
            }
          }),
          concatMap(page => {
            if (page) {
              const nextPage = page.number + 1;
              return nextPage < page.totalPages ? of(nextPage) : EMPTY;
            }
            return EMPTY;
          })
        )
      ),
      takeWhile(page => page !== null, true)
    );
  }

  createAssignee(): FormGroup {
    return this.formBuilder.group({
      assignee: ['', Validators.required]
    });
  }

  get assigneeList(): FormArray {
    return this.form.get('assigneeList') as FormArray;
  }

  get assigneeExclusionList(): FormArray {
    return this.form.get('assigneeExclusionList') as FormArray;
  }

  addAssignee(): void {
    this.assigneeList.push(this.createAssignee());
  }

  addAssigneeExclusion(): void {
    this.assigneeExclusionList.push(this.createAssignee());
  }

  removeAssignee(index: number): void {
    this.assigneeList.removeAt(index);
  }

  removeAssigneeExclusion(index: number): void {
    this.assigneeExclusionList.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const pullRequestUrl = this.form.value.pullRequestUrl;
    const assigneeList = this.form.value.assigneeList.map((assignee: any) => assignee.assignee);
    const assigneeExclusionList = this.form.value.assigneeExclusionList.map((assignee: any) => assignee.assignee);

    const request: PullRequestAssignRequest = {
      pullRequestUrl: pullRequestUrl,
      assigneeList: assigneeList,
      assigneeExclusionList: assigneeExclusionList,
    };
    console.log(`Review creation request: ${JSON.stringify(request)}`);

    this.reviewsService.createReview(request).subscribe(reviews => {
      console.log(`Created reviews: ${JSON.stringify(reviews)}`);
      if (reviews) {
        this.closeForm(reviews);
      }
    });
  }

  cancel(): void {
    if (this.form.dirty) {
      const confirmClose = window.confirm('You have unsaved changes. Do you really want to close this form?');
      if (!confirmClose) {
        return;
      }
    }
    this.closeForm(null);
  }

  private closeForm(reviews: PullRequestReview[] | null) {
    this.show = false;

    this.form.reset();
    this.assigneeList.clear();
    this.assigneeExclusionList.clear();

    this.reviews.emit(reviews);
  }

}
