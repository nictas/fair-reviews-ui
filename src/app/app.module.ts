import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DeveloperDetailComponent } from './developers/developer-detail.component';
import { DevelopersComponent } from './developers/developers.component';
import { LoginComponent } from './login/login.component';
import { AddMultiplierComponent } from './multipliers/add-multiplier.component';
import { MultiplierDetailComponent } from './multipliers/multiplier-detail.component';
import { MultipliersComponent } from './multipliers/multipliers.component';
import { AddReviewComponent } from './reviews/add-review.component';
import { ReviewDetailComponent } from './reviews/review-detail.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MessageComponent } from './shared/message.component';
// import { CsrfInterceptor } from './services/csrf-interceptor';
// import { DebugInterceptor } from './services/debug-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DevelopersComponent,
    LoginComponent,
    ReviewsComponent,
    MultipliersComponent,
    MultiplierDetailComponent,
    ReviewDetailComponent,
    DeveloperDetailComponent,
    AddMultiplierComponent,
    AddReviewComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'login-github', component: LoginComponent },
      { path: 'developers', component: DevelopersComponent },
      { path: 'developers/:login', component: DeveloperDetailComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'reviews/:id', component: ReviewDetailComponent },
      { path: 'multipliers', component: MultipliersComponent },
      { path: 'multipliers/:id', component: MultiplierDetailComponent },
      { path: '', redirectTo: 'developers', pathMatch: 'full' },
      { path: '**', redirectTo: 'developers', pathMatch: 'full' }
    ]),
  ],
  providers: [
    provideHttpClient(
      withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' })
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
