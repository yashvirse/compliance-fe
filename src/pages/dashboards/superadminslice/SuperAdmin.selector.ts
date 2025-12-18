// src/features/SuperAdmin/SuperAdmin.selector.ts

import type { RootState } from "../../../app/store";

export const selectSuperAdminLoading = (state: RootState) =>
  state.superAdmin.loading;

export const selectSuperAdminError = (state: RootState) =>
  state.superAdmin.error;

export const selectSuperAdminDashboardData = (state: RootState) =>
  state.superAdmin.dashboardData;
