import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";

const selectMakerDashboardState = (state: RootState) => state.makerDashboard;

// ===== Assigned Tasks Selectors =====
export const selectAssignedTasks = createSelector(
  [selectMakerDashboardState],
  (state) => state.tasks,
);

export const selectMakerDashboardLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.loading,
);

export const selectMakerDashboardError = createSelector(
  [selectMakerDashboardState],
  (state) => state.error,
);

// ===== Task Counts (Dashboard Stats) Selectors =====
export const selectTaskCounts = createSelector(
  [selectMakerDashboardState],
  (state) => state.counts,
);

export const selectDashboardLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.loading,
);

export const selectDashboardError = createSelector(
  [selectMakerDashboardState],
  (state) => state.error,
);

// ===== Task Action (Approve/Reject) Selectors =====
export const selectTaskActionsLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.taskActionsLoading,
);

export const selectTaskActionsError = createSelector(
  [selectMakerDashboardState],
  (state) => state.taskActionsError,
);

// ===== Pending Tasks Selectors =====
export const selectPendingTasks = createSelector(
  [selectMakerDashboardState],
  (state) => state.pendingTasks,
);

export const selectPendingTasksLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.pendingTasksLoading,
);

export const selectPendingTasksError = createSelector(
  [selectMakerDashboardState],
  (state) => state.pendingTasksError,
);

// ===== Approved Tasks Selectors =====
export const selectApprovedTasks = createSelector(
  [selectMakerDashboardState],
  (state) => state.approvedTasks,
);

export const selectApprovedTasksLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.approvedTasksLoading,
);

export const selectApprovedTasksError = createSelector(
  [selectMakerDashboardState],
  (state) => state.approvedTasksError,
);

// ===== Rejected Tasks Selectors =====
export const selectRejectedTasks = createSelector(
  [selectMakerDashboardState],
  (state) => state.rejectedTasks,
);

export const selectRejectedTasksLoading = createSelector(
  [selectMakerDashboardState],
  (state) => state.rejectedTasksLoading,
);

export const selectRejectedTasksError = createSelector(
  [selectMakerDashboardState],
  (state) => state.rejectedTasksError,
);
