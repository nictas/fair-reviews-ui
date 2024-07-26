import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { DevelopersService } from '../services/developers.service';
import { GlobalMessageService } from '../services/global-message.service';
import { UserInfoService } from '../services/user-info.service';
import { mergeUnique } from '../shared/merge';

@Component({
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

  get pageTitle() {
    return 'Developers';
  }

  get pageSize() {
    return 20;
  }

  private _developersFilter = '';

  get developersFilter(): string {
    return this._developersFilter;
  }

  set developersFilter(filter: string) {
    this._developersFilter = filter;
    this.updateShownDevelopers();
  }

  private _developers: Developer[] = [];

  get developers(): Developer[] {
    return this._developers;
  }

  set developers(developers: Developer[]) {
    this._developers = developers;
    this.updateShownDevelopers();
  }

  shownDevelopers: Developer[] = [];
  developersLoading = true;

  currentPage = 0;
  totalPages = 0;
  sortField = 'score';
  sortDirection = 'asc';
  isAdmin = false;
  showConfirmDialog = false;
  developerToDelete: string | null = null;

  constructor(
    private globalMessageService: GlobalMessageService,
    private userInfoService: UserInfoService,
    private developersService: DevelopersService
  ) { }

  ngOnInit(): void {
    this.userInfoService.isUserAdmin().subscribe(isAdmin => {
      if (isAdmin) {
        this.isAdmin = isAdmin;
      }
      this.fetchPage(this.currentPage, this.pageSize).subscribe(page => this.vizualizePage(page));
    });
  }

  private fetchPage(page: number, pageSize: number): Observable<PaginatedResponse<Developer> | null> {
    this.developersLoading = true;
    return this.developersService.getDevelopers(page, pageSize, this.sortField, this.sortDirection).pipe(
      // delay(2000), // Uncomment to test the loading indicator
      tap(page => console.log(`Fetched developers page: ${JSON.stringify(page)}`)),
      tap(page => this.developersLoading = false)
    );
  }

  private vizualizePage(page: PaginatedResponse<Developer> | null): void {
    if (page) {
      this.developers = mergeUnique(this.developers, page.content, developer => developer.login);
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
    if (this.developersLoading) {
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
        this.developers = page.content;
      }
    });
  }

  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    }
    return '';
  }

  confirmDelete(login: string): void {
    this.developerToDelete = login;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.developerToDelete = null;
  }

  deleteDeveloper(): void {
    if (this.developerToDelete) {
      this.developersService.deleteDeveloper(this.developerToDelete).subscribe(success => {
        if (success) {
          this.refreshOpenPages();
        }
        this.showConfirmDialog = false;
        this.developerToDelete = null;
      });
    }
  }

  updateShownDevelopers(): void {
    let filter = this.developersFilter.toLowerCase();
    this.shownDevelopers = this.developers.filter(developer => {
      let login = developer.login.toLowerCase();
      let email = developer.email.toLowerCase();
      return login.includes(filter) || email.includes(filter);
    });
  }

  syncDevelopers() {
    this.developersService.syncDevelopers().subscribe(success => {
      if (success) {
        this.globalMessageService.showSuccessMessage("Developer synchronization scheduled. Please refresh the page in a few moments to see the results.");
      }
    });
  }

}
