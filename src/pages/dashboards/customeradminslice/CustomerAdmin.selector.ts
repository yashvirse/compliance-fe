import type { RootState } from "../../../app/store";

export const selectCustomerAdminLoading = (state: RootState) =>
  state.customerAdmin.loading;

export const selectCustomerAdminError = (state: RootState) =>
  state.customerAdmin.error;

export const selectCustomerAdminDashboardData = (state: RootState) =>
  state.customerAdmin.dashboardData;
export const selectCompletedTasks = (state: RootState) =>
  state.customerAdmin.completedTasks;
export const selectRejectedTasks = (state: RootState) =>
  state.customerAdmin.rejectedTasks;
export const selectPendingTasks = (state: RootState) =>
  state.customerAdmin.pendingTasks;
export const selectAssignedTasks = (state: RootState) =>
  state.customerAdmin.asignedTasks;
export const selectSiteWiseTasks = (state: RootState) =>
  state.customerAdmin.siteWiseTasks;
