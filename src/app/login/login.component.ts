import { Component } from '@angular/core';

@Component({
  selector: 'fr-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginWithGitHub(): void {
    window.location.href = 'http://localhost:8090/oauth2/authorization/github';
  }

}
