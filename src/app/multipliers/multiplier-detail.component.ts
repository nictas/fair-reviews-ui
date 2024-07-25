import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, tap } from 'rxjs';
import { FileMultiplier, Multiplier } from '../model/Multiplier';
import { MultipliersService } from '../services/multipliers.service';
import { UserInfoService } from '../services/user-info.service';

@Component({
  templateUrl: './multiplier-detail.component.html',
  styleUrls: ['./multiplier-detail.component.css']
})
export class MultiplierDetailComponent implements OnInit {

  multiplier: Multiplier | null = null;
  fileMultipliers: FileMultiplier[] = [];
  shownFileMultipliers: FileMultiplier[] = [];
  dataLoading = true;
  isCollapsed = false;
  showConfirmDialog = false;
  multiplierToDelete: string | null = null;
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
    private multipliersService: MultipliersService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    const multiplierId = this.route.snapshot.paramMap.get('id');
    if (multiplierId) {
      this.dataLoading = true;
      this.userInfoService.isUserAdmin().subscribe(isAdmin => {
        if (isAdmin) {
          this.isAdmin = isAdmin;
        }
      });
      this.multipliersService.getMultiplier(multiplierId).pipe(
        delay(2000), // Uncomment to test the loading indicator
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
        tap(data => {
          this.dataLoading = false;
        })
      ).subscribe(multiplier => {
        if (multiplier) {
          this.multiplier = multiplier;
          this.fileMultipliers = multiplier.fileMultipliers;
          this.updateShown();
        }
      });
    }
  }

  updateShown(): void {
    let filter = this.filter.toLowerCase();
    this.shownFileMultipliers = this.fileMultipliers.filter(fileMultiplier => {
      let id = fileMultiplier.id.toLowerCase();
      let extension = fileMultiplier.fileExtension.toLowerCase();
      return id.includes(filter) || extension.includes(filter);
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/multipliers']);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  confirmDelete(id: string | null): void {
    this.multiplierToDelete = id;
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
    this.multiplierToDelete = null;
  }

  deleteMultiplier(): void {
    if (this.multiplierToDelete) {
      this.multipliersService.deleteMultiplier(this.multiplierToDelete).subscribe(success => {
        this.showConfirmDialog = false;
        this.multiplierToDelete = null;
        if (success) {
          this.goBack();
        }
      });
    }
  }

}
