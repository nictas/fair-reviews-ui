import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DevelopersComponent } from './developers/developers.component';
import { LoginComponent } from './login/login.component';
import { MultipliersComponent } from './multipliers/multipliers.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MultiplierDetailComponent } from './multipliers/multiplier-detail.component';
import { ReviewDetailComponent } from './reviews/review-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DevelopersComponent,
    LoginComponent,
    ReviewsComponent,
    MultipliersComponent,
    MultiplierDetailComponent,
    ReviewDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'login-github', component: LoginComponent },
      { path: 'developers', component: DevelopersComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'reviews/:id', component: ReviewDetailComponent },
      { path: 'multipliers', component: MultipliersComponent },
      { path: 'multipliers/:id', component: MultiplierDetailComponent }
    ])
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
