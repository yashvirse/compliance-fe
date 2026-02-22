import type { RootState } from "../../../app/store";

export const selectMusterLoading = (state: RootState) =>
  state.apiIntegration.musterLoading;

export const selectMusterError = (state: RootState) =>
  state.apiIntegration.musterError;

export const selectMusterSuccess = (state: RootState) =>
  state.apiIntegration.musterSuccess;

export const selectSalaryLoading = (state: RootState) =>
  state.apiIntegration.salaryLoading;

export const selectSalaryError = (state: RootState) =>
  state.apiIntegration.salaryError;

export const selectSalarySuccess = (state: RootState) =>
  state.apiIntegration.salarySuccess;

export const selectApiIntegrationState = (state: RootState) =>
  state.apiIntegration;
