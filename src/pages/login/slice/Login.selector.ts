import type { RootState } from '../../../app/store';

// Select loading state
export const selectLoginLoading = (state: RootState) => state.login.loading;

// Select error state
export const selectLoginError = (state: RootState) => state.login.error;

// Select user data
export const selectUser = (state: RootState) => state.login.user;

// Select token
export const selectToken = (state: RootState) => state.login.token;

// Select authentication status
export const selectIsAuthenticated = (state: RootState) => state.login.isAuthenticated;

// Select initializing status
export const selectIsInitializing = (state: RootState) => state.login.isInitializing;

// Select complete login state
export const selectLoginState = (state: RootState) => state.login;
