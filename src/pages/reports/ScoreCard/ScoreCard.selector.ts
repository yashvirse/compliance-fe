import type { RootState } from "../../../app/store";

/* =======================
   Base selector
======================= */
export const selectScoreCardState = (state: RootState) => state.scoreCard;

/* =======================
   API response selectors
======================= */

// raw api response
export const selectScoreCardData = (state: RootState) => state.scoreCard.report;

// loading flag
export const selectScoreCardLoading = (state: RootState) =>
  state.scoreCard.loading;

// error message
export const selectScoreCardError = (state: RootState) => state.scoreCard.error;
export const selectDepartments = (state: RootState) =>
  state.scoreCard.departments;

export const selectDepartmentLoading = (state: RootState) =>
  state.scoreCard.loading;

export const selectDepartmentError = (state: RootState) =>
  state.scoreCard.error;
export const selectSites = (state: RootState) => state.scoreCard.sites;

export const selectSiteLoading = (state: RootState) => state.scoreCard.loading;

export const selectSiteError = (state: RootState) => state.scoreCard.error;
