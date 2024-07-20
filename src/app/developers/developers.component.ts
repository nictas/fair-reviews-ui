import { Component, OnInit } from '@angular/core';
import { Developer } from '../model/Developer';
import { DevelopersService } from '../services/developers.service';

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

  developers: Developer[] = [];
  developersLoading = true;
  page = 0;
  totalPages = 0;

  constructor(private developersService: DevelopersService) { }

  ngOnInit(): void {
    this.fetchDevelopers(this.page, this.pageSize);
  }

  private fetchDevelopers(page: number, size: number): void {
    this.developersLoading = true;

    this.developersService.getDevelopers(page, size).subscribe(developersPage => {
      console.log(`Fetched developers: ${JSON.stringify(developersPage)}`);
      this.developers = [...this.developers, ...developersPage.content];
      this.totalPages = developersPage.totalPages;
      this.developersLoading = false;
      this.page = page;
    });
  }

  loadMore(): void {
    if (this.page < this.totalPages - 1) {
      this.fetchDevelopers(this.page + 1, this.pageSize);
    }
  }

}
