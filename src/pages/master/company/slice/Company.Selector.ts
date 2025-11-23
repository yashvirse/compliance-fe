import type { RootState } from '../../../../app/store';

// Selector to get loading state
export const selectCompanyLoading = (state: RootState) => state.company?.loading || false;

// Selector to get error state
export const selectCompanyError = (state: RootState) => state.company?.error || null;

// Selector to get success state
export const selectCompanySuccess = (state: RootState) => state.company?.success || false;

// Selector to get all companies
export const selectCompanies = (state: RootState) => state.company?.companies || [];

// Selector to get entire company state
export const selectCompanyState = (state: RootState) => state.company;
