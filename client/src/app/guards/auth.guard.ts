// Make sure users are logged in

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Function to check if user is authorized to view route

  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // check if user if logged in
    if (this.authService.loggedIn()){
      return true; //user is allowed to view route
    } else {
      this.redirectUrl = state.url; //grab the previous url that was visited
      this.router.navigate(['/login'])
      return false; //user is not allowed to view page
    }
  }
}
