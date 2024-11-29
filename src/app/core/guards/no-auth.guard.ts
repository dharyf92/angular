import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';

export const isNotAuthenticated: CanActivateFn = async () => {
  const store = inject(Store);
  const router = inject(Router);
  const firebaseAuthenticationService = inject(FirebaseAuthenticationService);

  const isAuthenticated = store.selectSnapshot(
    AuthSelectors.getIsAuthenticated
  );

  const user = await firebaseAuthenticationService.getCurrentUser();

  if (isAuthenticated && user) {
    return router.navigate(['/main-tabs/main-picks'], { replaceUrl: true });
  }

  return true;
};
