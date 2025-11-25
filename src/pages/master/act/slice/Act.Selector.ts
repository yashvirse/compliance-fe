import type { RootState } from '../../../../app/store';

// Selectors for Act Master state
export const selectActMasterLoading = (state: RootState) => state.actMaster.loading;
export const selectActMasterError = (state: RootState) => state.actMaster.error;
export const selectActMasterSuccess = (state: RootState) => state.actMaster.success;
export const selectActMasters = (state: RootState) => state.actMaster.actMasters;
export const selectActMasterDeleteLoading = (state: RootState) => state.actMaster.deleteLoading;
export const selectActMasterDeleteSuccess = (state: RootState) => state.actMaster.deleteSuccess;
export const selectActMasterDeleteError = (state: RootState) => state.actMaster.deleteError;
export const selectCurrentActMaster = (state: RootState) => state.actMaster.currentActMaster;
export const selectFetchByIdLoading = (state: RootState) => state.actMaster.fetchByIdLoading;
export const selectFetchByIdError = (state: RootState) => state.actMaster.fetchByIdError;
