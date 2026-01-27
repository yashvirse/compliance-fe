// FileExplorer.selector.ts

import type { RootState } from "../../../app/store";

export const selectFileExplorerLoading = (state: RootState) =>
  state.fileExplorer.loading;

export const selectFileExplorerError = (state: RootState) =>
  state.fileExplorer.error;

export const selectFileExplorerSuccessMessage = (state: RootState) =>
  state.fileExplorer.successMessage;
