import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Observable, tap } from 'rxjs';
import { FileMultiplier, Multiplier } from '../model/Multiplier';
import { MultipliersService } from '../services/multipliers.service';

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

  private _filter = '';
  get filter(): string {
    return this._filter;
  }

  set filter(filter: string) {
    this._filter = filter;
    this.updateShownFileMultipliers();
  }


  constructor(
    private multipliersService: MultipliersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const multiplierId = this.route.snapshot.paramMap.get('id');
    if (multiplierId) {
      this.dataLoading = true;
      this.fetchMultiplier(multiplierId).pipe(
        delay(2000), // Uncomment to test the loading indicator
        tap(data => console.log(`Fetched data: ${JSON.stringify(data)}`)),
        tap(data => {
          this.dataLoading = false;
        })
      ).subscribe(multiplier => {
        this.multiplier = multiplier;
        this.fileMultipliers = multiplier.fileMultipliers;
        this.updateShownFileMultipliers();
      });
    }
  }

  private fetchMultiplier(id: string): Observable<Multiplier> {
    return this.multipliersService.getMultiplier(id);
  }

  updateShownFileMultipliers(): void {
    let filter = this.filter.toLowerCase();
    this.shownFileMultipliers = this.fileMultipliers.filter(fileMultiplier => {
      let id = fileMultiplier.id.toLowerCase();
      let extension = fileMultiplier.fileExtension.toLowerCase();
      return id.includes(filter) || extension.includes(filter);
    });
  }

  goBack(): void {
    this.router.navigate(['/multipliers']);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

}
