import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UDSApiService } from '../services/uds-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private api: UDSApiService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Redirect, if not logged in, to login screen
    if (!this.api.user.isLogged) {
      this.api.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
