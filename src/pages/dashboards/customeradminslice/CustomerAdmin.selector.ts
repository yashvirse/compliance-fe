import type { RootState } from "../../../app/store";

export const selectCustomerAdminLoading = (state: RootState) =>
  state.customerAdmin.loading;

export const selectCustomerAdminError = (state: RootState) =>
  state.customerAdmin.error;

export const selectCustomerAdminDashboardData = (state: RootState) =>
  state.customerAdmin.dashboardData;
export const selectCompletedTasks = (state: RootState) =>
  state.customerAdmin.completedTasks;
export const selectAssignedTasks = (state: RootState) =>
  state.customerAdmin.asignedTasks;
