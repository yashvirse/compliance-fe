import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

const selectCheckerDashboardState = (state: RootState) => state.checkerDashboard;

// ===== Task Counts (Dashboard Stats) Selectors =====
export const selectCheckerTaskCounts = createSelector(
  [selectCheckerDashboardState],
  (state) => state.counts
);

export const selectCheckerDashboardLoading = createSelector(
  [selectCheckerDashboardState],
  (state) => state.loading
);

export const selectCheckerDashboardError = createSelector(
  [selectCheckerDashboardState],
  (state) => state.error
);

// ===== Task Action (Approve/Reject) Selectors =====
export const selectCheckerTaskActionsLoading = createSelector(
  [selectCheckerDashboardState],
  (state) => state.taskActionsLoading
);

export const selectCheckerTaskActionsError = createSelector(
  [selectCheckerDashboardState],
  (state) => state.taskActionsError
);

// ===== Pending Check Tasks Selectors =====
export const selectPendingCheckTasks = createSelector(
  [selectCheckerDashboardState],
  (state) => state.pendingCheckTasks
);

export const selectPendingCheckTasksLoading = createSelector(
  [selectCheckerDashboardState],
  (state) => state.pendingCheckTasksLoading
);

export const selectPendingCheckTasksError = createSelector(
  [selectCheckerDashboardState],
  (state) => state.pendingCheckTasksError
);

// ===== Approved Check Tasks Selectors =====
export const selectApprovedCheckTasks = createSelector(
  [selectCheckerDashboardState],
  (state) => state.approvedCheckTasks
);

export const selectApprovedCheckTasksLoading = createSelector(
  [selectCheckerDashboardState],
  (state) => state.approvedCheckTasksLoading
);

export const selectApprovedCheckTasksError = createSelector(
  [selectCheckerDashboardState],
  (state) => state.approvedCheckTasksError
);

// ===== Rejected Check Tasks Selectors =====
export const selectRejectedCheckTasks = createSelector(
  [selectCheckerDashboardState],
  (state) => state.rejectedCheckTasks
);

export const selectRejectedCheckTasksLoading = createSelector(
  [selectCheckerDashboardState],
  (state) => state.rejectedCheckTasksLoading
);

export const selectRejectedCheckTasksError = createSelector(
  [selectCheckerDashboardState],
  (state) => state.rejectedCheckTasksError
);
