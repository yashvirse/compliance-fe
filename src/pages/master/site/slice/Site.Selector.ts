import type { RootState } from '../../../../app/store';

export const selectSites = (state: RootState) => state.site.sites;
export const selectSiteLoading = (state: RootState) => state.site.loading;
export const selectSiteError = (state: RootState) => state.site.error;
export const selectSiteSuccessMessage = (state: RootState) => state.site.successMessage;
