import { Component, OnInit } from '@angular/core';
import { DeveloperService } from './developer.service';

@Component({
  selector: 'fr-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'fair-reviews-ui';

  constructor(private developerService: DeveloperService) { }

  ngOnInit(): void {
    this.developerService.getDevelopers();
  }
}
