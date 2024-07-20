import { Component, OnInit } from '@angular/core';
import { Developer } from '../model/Developer';
import { DevelopersService } from '../services/developers.service';
import { delay } from 'rxjs';

@Component({
  selector: 'fr-developers',
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

  get pageTitle() {
    return 'Developers';
  }

  developers: Developer[] = [];
  developersLoading = true;

  constructor(private developersService: DevelopersService) { }

  ngOnInit(): void {
    this.developersService.getDevelopers().pipe(delay(5000)).subscribe(developersPage => {
      console.log(`Fetched developers: ${JSON.stringify(developersPage)}`);
      this.developers = developersPage.content;
      this.developersLoading = false;
    });
  }

}
