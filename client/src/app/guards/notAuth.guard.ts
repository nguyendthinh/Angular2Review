// Make sure users are not logged in

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Function to check if user is authorized to view route
  canActivate() {
    // check if user is logged in
    if (this.authService.loggedIn()){
      this.router.navigate(['/']) // route to homepage
      return false; //user can't view route
    } else {
      return true; //user is allowed to view route
    }
  }
}
