import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

export const selectDashboardState = (state: RootState) => state.dashboard;

export const selectTaskCounts = createSelector(
  [selectDashboardState],
  (state) => state.counts
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (state) => state.loading
);

export const selectDashboardError = createSelector(
  [selectDashboardState],
  (state) => state.error
);
