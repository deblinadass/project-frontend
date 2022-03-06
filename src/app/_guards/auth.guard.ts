import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService) { }

  canActivate() {
    if (this.authenticationService.isLoggedIn()) {
    return true;
    }
    return false;
  }
}
