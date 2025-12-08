import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

const selectMakerDashboardState = (state: RootState) => state.makerDashboard;

// ===== Assigned Tasks Selectors =====
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

// ===== Task Counts (Dashboard Stats) Selectors =====
export const selectTaskCounts = createSelector(
  [selectMakerDashboardState],
  (state) => state.counts
);

export const selectDashboardLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.loading
);

export const selectDashboardError = createSelector(
  [selectMakerDashboardState],
  (state) => state.error
);

// ===== Task Action (Approve/Reject) Selectors =====
export const selectTaskActionsLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.taskActionsLoading
);

export const selectTaskActionsError = createSelector(
  [selectMakerDashboardState],
  (state) => state.taskActionsError
);
