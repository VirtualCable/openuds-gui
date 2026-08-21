import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UDSApiService } from '../services/uds-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private api = inject(UDSApiService);

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Redirect, if not logged in, to login screen
    if (!this.api.user.isLogged) {
      this.api.router.navigate(['login']);
      return false;
    }

    return true;
  }
}
