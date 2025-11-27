import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';

// Base selectors
export const selectCustomerAdminUserState = (state: RootState) => 
  state.customerAdminUser;

export const selectUsers = createSelector(
  [selectCustomerAdminUserState],
  (state) => state.users
);

export const selectUserLoading = createSelector(
  [selectCustomerAdminUserState],
  (state) => state.loading
);

export const selectUserError = createSelector(
  [selectCustomerAdminUserState],
  (state) => state.error
);
