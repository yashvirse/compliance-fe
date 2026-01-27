import type { RootState } from "../../../app/store";

export const selectTemplateFormaterLoading = (state: RootState) =>
  state.templateFormater.loading;

export const selectTemplateFormaterError = (state: RootState) =>
  state.templateFormater.error;

export const selectTemplateFormaterSuccess = (state: RootState) =>
  state.templateFormater.success;
export const selectTemplateFormaterTemplates = (state: RootState) =>
  state.templateFormater.templates;
export const selectTemplateFormaterDetail = (state: any) =>
  state.templateFormater.templateDetail;
