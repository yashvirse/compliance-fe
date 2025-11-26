import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';

const selectActivityMasterState = (state: RootState) => state.activityMaster;

export const selectActivityMasterLoading = createSelector(
  selectActivityMasterState,
  (state) => state.loading
);

export const selectActivityMasterError = createSelector(
  selectActivityMasterState,
  (state) => state.error
);

export const selectActivityMasterSuccess = createSelector(
  selectActivityMasterState,
  (state) => state.success
);

export const selectActivityMasters = createSelector(
  selectActivityMasterState,
  (state) => state.activityMasters
);

export const selectActivityMasterDeleteLoading = createSelector(
  selectActivityMasterState,
  (state) => state.deleteLoading
);

export const selectActivityMasterDeleteError = createSelector(
  selectActivityMasterState,
  (state) => state.deleteError
);

export const selectActivityMasterDeleteSuccess = createSelector(
  selectActivityMasterState,
  (state) => state.deleteSuccess
);

export const selectCurrentActivityMaster = createSelector(
  selectActivityMasterState,
  (state) => state.currentActivityMaster
);

export const selectFetchByIdLoading = createSelector(
  selectActivityMasterState,
  (state) => state.fetchByIdLoading
);

export const selectFetchByIdError = createSelector(
  selectActivityMasterState,
  (state) => state.fetchByIdError
);

export const selectDepartmentDropdown = createSelector(
  selectActivityMasterState,
  (state) => state.departmentDropdown
);

export const selectDepartmentDropdownLoading = createSelector(
  selectActivityMasterState,
  (state) => state.departmentDropdownLoading
);
