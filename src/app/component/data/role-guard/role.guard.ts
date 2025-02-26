import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { combineLatest, first, map, tap } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles: string[] = route.data['roles'] || [];

  console.log('RoleGuard triggered for route:', route.url.join('/'));
  console.log('RoleGuard - Expected roles:', expectedRoles);

  return combineLatest([
    authService.userRole$,
    authService.sessionChecked$,
  ]).pipe(
    first(([userRole, sessionChecked]) => sessionChecked), // Wait until session is checked
    tap(([userRole]) => console.log('RoleGuard - User role:', userRole)),
    map(([userRole]) => {
      if (userRole && expectedRoles.includes(userRole)) {
        console.log('RoleGuard - Access granted.');
        return true;
      } else {
        console.warn('RoleGuard - Access denied, redirecting.');
        router.navigate(['/main/home']);
        return false;
      }
    })
  );
};
