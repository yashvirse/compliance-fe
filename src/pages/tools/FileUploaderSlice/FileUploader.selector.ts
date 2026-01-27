// FileUploader.selector.ts

import type { RootState } from "../../../app/store";
export const selectUploaderLoading = (state: RootState) =>
  state.fileUploader.loading;

export const selectUploaderSuccess = (state: RootState) =>
  state.fileUploader.successMessage;

export const selectUploaderError = (state: RootState) =>
  state.fileUploader.error;

export const selectFileUploadLoading = (state: RootState) =>
  state.fileUploader.loading;

export const selectFileUploadError = (state: RootState) =>
  state.fileUploader.error;

export const selectFileUploadSuccessMessage = (state: RootState) =>
  state.fileUploader.successMessage;
export const selectFileList = (state: RootState) => state.fileUploader.files;
