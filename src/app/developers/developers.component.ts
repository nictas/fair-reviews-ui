import { Component, OnInit } from '@angular/core';
import { Developer } from '../model/Developer';
import { DevelopersService } from '../services/developers.service';

@Component({
  selector: 'fr-developers',
  templateUrl: './developers.component.html',
  styleUrl: './developers.component.css'
})
export class DevelopersComponent implements OnInit {

  get pageTitle() {
    return 'Developers';
  }

  developers: Developer[] = [];

  constructor(private developersService: DevelopersService) { }

  ngOnInit(): void {
    this.fetchDevelopers();
  }

  private fetchDevelopers(): void {
    this.developersService.getDevelopers().subscribe(developersPage => {
      console.log(`Fetched developers: ${JSON.stringify(developersPage)}`);
      setTimeout(() => {
        this.developers = developersPage.content;
      });
    });
  }

}
