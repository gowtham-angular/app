import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;  // User is logged in
        }

        this.router.navigate(['/signup'], { queryParams: { returnUrl: state.url } });
        return false;  // User is not logged in, redirect to login
      })
    );
  }
}
