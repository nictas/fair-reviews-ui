import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DevelopersComponent } from './developers/developers.component';
import { LoginComponent } from './login/login.component';
import { ReviewComponent } from './reviews/review.component';

@NgModule({
  declarations: [
    AppComponent,
    DevelopersComponent,
    LoginComponent,
    ReviewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'login-github', component: LoginComponent },
      { path: 'developers', component: DevelopersComponent },
      { path: 'reviews', component: ReviewComponent }
    ])
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
