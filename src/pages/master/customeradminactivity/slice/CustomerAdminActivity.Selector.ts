import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';
import type { GroupedActivityMaster } from './CustomerAdminActivity.Type';

// Base selectors
export const selectCustomerAdminActivityState = (state: RootState) => 
  state.customerAdminActivity;

export const selectActivityMasters = createSelector(
  [selectCustomerAdminActivityState],
  (state) => state.activities
);

export const selectActivityMasterLoading = createSelector(
  [selectCustomerAdminActivityState],
  (state) => state.loading
);

export const selectActivityMasterError = createSelector(
  [selectCustomerAdminActivityState],
  (state) => state.error
);

// Grouped activities selector - groups by actName + departmentName
export const selectGroupedActivityMasters = createSelector(
  [selectActivityMasters],
  (activities): GroupedActivityMaster[] => {
    const groups = new Map<string, GroupedActivityMaster>();

    activities.forEach((activity: any) => {
      const key = `${activity.actName}-${activity.departmentName}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          actName: activity.actName || '',
          departmentName: activity.departmentName || '',
          activities: []
        });
      }

      groups.get(key)?.activities.push(activity);
    });

    return Array.from(groups.values());
  }
);
