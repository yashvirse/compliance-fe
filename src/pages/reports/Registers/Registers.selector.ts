import type { RootState } from "../../../app/store";

/* =======================
   Base selector
======================= */

export const selectSalaryState = (state: RootState) => state.registers;

/* =======================
   API response selectors
======================= */

// raw api response (reports list)
export const selectSalaryReports = (state: RootState) =>
  state.registers.reports;

// loading flag
export const selectSalaryLoading = (state: RootState) =>
  state.registers.loading;

// error message
export const selectSalaryError = (state: RootState) => state.registers.error;
