import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

export const selectMakerDashboardState = (state: RootState) => state.makerDashboard;

export const selectAssignedTasks = createSelector(
  [selectMakerDashboardState],
  (state) => state.tasks
);

export const selectMakerDashboardLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.loading
);

export const selectMakerDashboardError = createSelector(
  [selectMakerDashboardState],
  (state) => state.error
);
