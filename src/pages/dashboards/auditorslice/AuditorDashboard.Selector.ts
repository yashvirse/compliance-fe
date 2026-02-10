import type { RootState } from "../../../app/store";

export const selectTaskCounts = (state: RootState) =>
  state.auditorDashboard.counts;
export const selectAuditorDashboardLoading = (state: RootState) =>
  state.auditorDashboard.loading;
export const selectAuditorDashboardError = (state: RootState) =>
  state.auditorDashboard.error;

export const selectPendingTasks = (state: RootState) =>
  state.auditorDashboard.pendingTasks;
export const selectPendingTasksLoading = (state: RootState) =>
  state.auditorDashboard.pendingTasksLoading;
export const selectPendingTasksError = (state: RootState) =>
  state.auditorDashboard.pendingTasksError;

export const selectApprovedTasks = (state: RootState) =>
  state.auditorDashboard.approvedTasks;
export const selectApprovedTasksLoading = (state: RootState) =>
  state.auditorDashboard.approvedTasksLoading;
export const selectApprovedTasksError = (state: RootState) =>
  state.auditorDashboard.approvedTasksError;

export const selectRejectedTasks = (state: RootState) =>
  state.auditorDashboard.rejectedTasks;
export const selectRejectedTasksLoading = (state: RootState) =>
  state.auditorDashboard.rejectedTasksLoading;
export const selectRejectedTasksError = (state: RootState) =>
  state.auditorDashboard.rejectedTasksError;
export const selectAssignedTasks = (state: RootState) =>
  state.auditorDashboard.tasks;
