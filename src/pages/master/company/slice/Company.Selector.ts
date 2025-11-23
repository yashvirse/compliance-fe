import type { RootState } from '../../../../app/store';

// Selector to get loading state
export const selectCompanyLoading = (state: RootState) => state.company?.loading || false;

// Selector to get error state
export const selectCompanyError = (state: RootState) => state.company?.error || null;

// Selector to get success state
export const selectCompanySuccess = (state: RootState) => state.company?.success || false;

// Selector to get all companies
export const selectCompanies = (state: RootState) => state.company?.companies || [];

// Selector to get fetch loading state
export const selectCompanyFetchLoading = (state: RootState) => state.company?.fetchLoading || false;

// Selector to get fetch error state
export const selectCompanyFetchError = (state: RootState) => state.company?.fetchError || null;

// Selector to get delete loading state
export const selectCompanyDeleteLoading = (state: RootState) => state.company?.deleteLoading || false;

// Selector to get delete error state
export const selectCompanyDeleteError = (state: RootState) => state.company?.deleteError || null;

// Selector to get delete success state
export const selectCompanyDeleteSuccess = (state: RootState) => state.company?.deleteSuccess || false;

// Selector to get entire company state
export const selectCompanyState = (state: RootState) => state.company;
