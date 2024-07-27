import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { PullRequestReview } from '../model/PullRequestReview';
import { ReviewsService } from '../services/reviews.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // Chart data
  public barChartOptions: ChartOptions = { responsive: true };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  // Chart data sets
  public totalAdditionsDeletions: ChartDataset[] = [];
  public dailyAdditionsDeletions: ChartDataset[] = [];
  public dailyScores: ChartDataset[] = [];
  public topDevelopersScores: ChartDataset[] = [];
  public topDevelopersLabels: string[] = []; // Declare the missing property

  constructor(private reviewsService: ReviewsService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.reviewsService.getReviews(0, 100, 'createdAt', 'desc').subscribe(data => {
      if (data) {
        const reviews = data.content;
        this.processData(reviews);
      }
    });
  }

  processData(reviews: PullRequestReview[]): void {
    const today = moment().startOf('day');
    const past14Days = Array.from({ length: 14 }, (_, i) => today.clone().subtract(i, 'days'));
    const totals = { additions: 0, deletions: 0, scores: 0 };
    const dailyData = past14Days.map(date => ({ date, additions: 0, deletions: 0, scores: 0 }));
    const developerScores: { [key: string]: number } = {};

    reviews.forEach(review => {
      const createdAt = moment(review.createdAt);
      if (createdAt.isSameOrAfter(today.clone().subtract(14, 'days'))) {
        const dailyEntry = dailyData.find(d => d.date.isSame(createdAt, 'day'));
        if (dailyEntry) {
          review.pullRequestFileDetails.changedFiles.forEach(file => {
            dailyEntry.additions += file.additions;
            dailyEntry.deletions += file.deletions;
          });
          dailyEntry.scores += review.score;

          totals.additions += review.pullRequestFileDetails.changedFiles.reduce((acc, file) => acc + file.additions, 0);
          totals.deletions += review.pullRequestFileDetails.changedFiles.reduce((acc, file) => acc + file.deletions, 0);
          totals.scores += review.score;

          if (developerScores[review.developer.login]) {
            developerScores[review.developer.login] += review.score;
          } else {
            developerScores[review.developer.login] = review.score;
          }
        }
      }
    });

    this.updateChartData(dailyData, totals, developerScores);
  }

  updateChartData(dailyData: any[], totals: any, developerScores: { [key: string]: number }): void {
    // Total additions and deletions for the last 14 days
    this.totalAdditionsDeletions = [
      { data: [totals.additions], label: 'Additions', backgroundColor: 'green' },
      { data: [totals.deletions], label: 'Deletions', backgroundColor: 'red' }
    ];

    // Daily additions and deletions for the last 14 days
    this.dailyAdditionsDeletions = [
      { data: dailyData.map(d => d.additions), label: 'Additions', backgroundColor: 'green' },
      { data: dailyData.map(d => d.deletions), label: 'Deletions', backgroundColor: 'red' }
    ];
    this.barChartLabels = dailyData.map(d => d.date.format('YYYY-MM-DD'));

    // Daily scores for the last 14 days
    this.dailyScores = [
      { data: dailyData.map(d => d.scores), label: 'Scores', backgroundColor: 'blue' }
    ];

    // Top 5 developers by score in the last 14 days
    const topDevelopers = Object.entries(developerScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    this.topDevelopersScores = [
      {
        data: topDevelopers.map(([, score]) => score),
        label: 'Scores',
        backgroundColor: 'orange'
      }
    ];
    this.topDevelopersLabels = topDevelopers.map(([login]) => login); // Update this property correctly
  }
}
