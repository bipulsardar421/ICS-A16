import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { combineLatest, first, map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("AuthGuard triggered for route:", state.url);

  return combineLatest([authService.isAuthenticated$, authService.sessionChecked$]).pipe(
    first(([isAuthenticated, sessionChecked]) => sessionChecked),
    tap(([isAuthenticated]) => console.log("AuthGuard - isAuthenticated (after session check):", isAuthenticated)),
    map(([isAuthenticated]) => {
      if (isAuthenticated) {
        return true;
      } else {
        console.warn("AuthGuard - Not authenticated, redirecting to /");
        router.navigate(['/']);
        return false;
      }
    })
  );
};
