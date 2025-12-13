import type { RootState } from '../../../app/store';

export const selectTaskCounts = (state: RootState) => state.auditorDashboard.taskCounts;
export const selectAuditorDashboardLoading = (state: RootState) => state.auditorDashboard.loading;
export const selectAuditorDashboardError = (state: RootState) => state.auditorDashboard.error;
export const selectAuditorDashboardSuccessMessage = (state: RootState) => state.auditorDashboard.successMessage;
export const selectPendingTasks = (state: RootState) => state.auditorDashboard.pendingTasks;
export const selectPendingTasksLoading = (state: RootState) => state.auditorDashboard.pendingTasksLoading;
export const selectPendingTasksError = (state: RootState) => state.auditorDashboard.pendingTasksError;
