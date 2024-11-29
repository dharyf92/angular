import { createPropertySelectors, createSelector } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';

export class AuthSelectors {
  static slices = createPropertySelectors<AuthStateModel>(AuthState);

  static getCredentials = createSelector(
    [AuthSelectors.slices.credentials],
    (credentials) => credentials
  );

  static getUser = createSelector(
    [AuthSelectors.slices.user],
    (state) => state
  );

  static getIsAuthenticated = createSelector(
    [AuthSelectors.slices.user, AuthSelectors.slices.credentials],
    (user, credentials) => !!user && !!credentials
  );
}
