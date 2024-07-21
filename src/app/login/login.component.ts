import { Component } from '@angular/core';
import { environment } from '../../environment/environment';

@Component({
  selector: 'fr-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private gatewayUrl = environment.gatewayUrl;

  loginWithGitHub(): void {
    window.location.href = `${this.gatewayUrl}/oauth2/authorization/github`;
  }

}
