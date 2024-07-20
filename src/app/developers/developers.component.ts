import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Developer } from '../model/Developer';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { DevelopersService } from '../services/developers.service';

@Component({
  selector: 'fr-developers',
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

  developers: Developer[] = [];
  developersLoading = true;
  currentPage = 0;
  totalPages = 0;
  sortField = 'score';
  sortDirection = 'asc';

  constructor(private developersService: DevelopersService) { }

  ngOnInit(): void {
    this.fetchPage(this.currentPage, this.pageSize).subscribe(page => this.vizualizePage(page));
  }

  private fetchPage(page: number, pageSize: number): Observable<PaginatedResponse<Developer>> {
    this.developersLoading = true;

    return this.developersService.getDevelopers(page, pageSize, this.sortField, this.sortDirection).pipe(
      // delay(2000), // Uncomment to test the loading indicator
      tap(page => console.log(`Fetched developers page: ${JSON.stringify(page)}`)),
      tap(page => this.developersLoading = false)
    );
  }

  private vizualizePage(page: PaginatedResponse<Developer>): void {
    this.developers = [...this.developers, ...page.content];
    this.totalPages = page.totalPages;
    this.currentPage = page.number;
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
    this.fetchPage(0, (this.currentPage + 1) * this.pageSize).subscribe(page => {
      this.developers = page.content;
    });
  }

  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    }
    return '';
  }

}
