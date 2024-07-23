import { Component, OnInit } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { Multiplier } from '../model/Multiplier';
import { PaginatedResponse } from '../model/PaginatedResponse';
import { MultipliersService } from '../services/multipliers.service';
import { UserInfoService } from '../services/user-info.service';
import { mergeUnique } from '../shared/merge';

@Component({
  templateUrl: './multipliers.component.html',
  styleUrls: ['./multipliers.component.css']
})
export class MultipliersComponent implements OnInit {

  get pageTitle() {
    return 'Multipliers';
  }

  get pageSize() {
    return 5;
  }

  private _multipliersFilter = '';

  get multipliersFilter(): string {
    return this._multipliersFilter;
  }

  set multipliersFilter(filter: string) {
    this._multipliersFilter = filter;
    this.updateShownMultipliers();
  }

  private _multipliers: Multiplier[] = [];

  get multipliers(): Multiplier[] {
    return this._multipliers;
  }

  set multipliers(multipliers: Multiplier[]) {
    this._multipliers = multipliers;
    this.updateShownMultipliers();
  }

  shownMultipliers: Multiplier[] = [];
  multipliersLoading = true;

  currentPage = 0;
  totalPages = 0;
  sortField = 'createdAt';
  sortDirection = 'desc';
  isAdmin = false;
  showConfirmDialog = false;
  multiplierToDelete: string | null = null;

  constructor(
    private multipliersService: MultipliersService,
    private userInfoService: UserInfoService
  ) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      this.isAdmin = userInfo.roles.includes('ROLE_ADMIN');
      this.fetchPage(this.currentPage, this.pageSize).subscribe(page => this.vizualizePage(page));
    });
  }

  private fetchPage(page: number, pageSize: number): Observable<PaginatedResponse<Multiplier>> {
    this.multipliersLoading = true;
    return this.multipliersService.getMultipliers(page, pageSize, this.sortField, this.sortDirection).pipe(
      delay(2000), // Uncomment to test the loading indicator
      tap(page => console.log(`Fetched multipliers page: ${JSON.stringify(page)}`)),
      tap(page => this.multipliersLoading = false)
    );
  }

  private vizualizePage(page: PaginatedResponse<Multiplier>): void {
    this.multipliers = mergeUnique(this.multipliers, page.content, multiplier => multiplier.id);
    this.totalPages = page.totalPages;
    this.currentPage = page.number;
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.fetchPage(this.currentPage + 1, this.pageSize).subscribe(page => this.vizualizePage(page));
    }
  }

  onSortChange(field: string): void {
    if (this.multipliersLoading) {
      return;
    }
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';  // Reset to ascending if a new field is clicked
    }
    this.fetchPage(0, (this.currentPage + 1) * this.pageSize).subscribe(page => {
      this.multipliers = page.content;
    });
  }

  getSortArrowClass(field: string): string {
    if (this.sortField === field) {
      return this.sortDirection === 'asc' ? 'arrow-up' : 'arrow-down';
    }
    return '';
  }

  confirmDelete(login: string): void {
    this.multiplierToDelete = login;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.multiplierToDelete = null;
  }

  deleteMultiplier(): void {
    if (this.multiplierToDelete) {
      this.multipliersService.deleteMultiplier(this.multiplierToDelete).subscribe(() => {
        this.multipliers = this.multipliers.filter(multiplier => multiplier.id !== this.multiplierToDelete);
        this.showConfirmDialog = false;
        this.multiplierToDelete = null;
      });
    }
  }

  updateShownMultipliers(): void {
    let filter = this.multipliersFilter.toLowerCase();
    this.shownMultipliers = this.multipliers.filter(multiplier => {
      let id = multiplier.id.toLowerCase();
      return id.includes(filter);
    });
  }

}
