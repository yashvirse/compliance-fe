import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';

// Base selector
const selectDepartmentMasterState = (state: RootState) => state.departmentMaster;

// Selectors
export const selectDepartmentMasterLoading = createSelector(
  selectDepartmentMasterState,
  (state) => state.loading
);

export const selectDepartmentMasterError = createSelector(
  selectDepartmentMasterState,
  (state) => state.error
);

export const selectDepartmentMasterSuccess = createSelector(
  selectDepartmentMasterState,
  (state) => state.success
);

export const selectDepartmentMasters = createSelector(
  selectDepartmentMasterState,
  (state) => state.departmentMasters
);

export const selectDepartmentMasterDeleteLoading = createSelector(
  selectDepartmentMasterState,
  (state) => state.deleteLoading
);

export const selectDepartmentMasterDeleteError = createSelector(
  selectDepartmentMasterState,
  (state) => state.deleteError
);

export const selectDepartmentMasterDeleteSuccess = createSelector(
  selectDepartmentMasterState,
  (state) => state.deleteSuccess
);

export const selectCurrentDepartmentMaster = createSelector(
  selectDepartmentMasterState,
  (state) => state.currentDepartmentMaster
);

export const selectFetchByIdLoading = createSelector(
  selectDepartmentMasterState,
  (state) => state.fetchByIdLoading
);

export const selectFetchByIdError = createSelector(
  selectDepartmentMasterState,
  (state) => state.fetchByIdError
);
