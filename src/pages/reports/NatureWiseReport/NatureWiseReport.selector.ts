import type { RootState } from "../../../app/store";

export const selectNatureWiseReportLoading = (state: RootState) =>
  state.natureWiseReport.loading;

export const selectNatureWiseReportError = (state: RootState) =>
  state.natureWiseReport.error;

export const selectNatureWiseReportList = (state: RootState) =>
  state.natureWiseReport.NatureWiseReportList;
