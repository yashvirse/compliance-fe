/**
 * useDashboardTasks Hook - Consolidate dashboard task state management
 * Benefits: Reduced code duplication, single source of truth, easier maintenance
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface TasksData {
  pending: any[];
  approved: any[];
  rejected: any[];
  counts: any;
}

interface UseDashboardTasksReturn {
  data: TasksData;
  loading: {
    overall: boolean;
    pending: boolean;
    approved: boolean;
    rejected: boolean;
  };
  error: {
    overall: string | null;
    pending: string | null;
    approved: string | null;
    rejected: string | null;
  };
  isEmpty: boolean;
  hasError: boolean;
}

interface UseDashboardTasksConfig {
  selectPending: (state: RootState) => any[];
  selectApproved: (state: RootState) => any[];
  selectRejected: (state: RootState) => any[];
  selectPendingLoading: (state: RootState) => boolean;
  selectApprovedLoading: (state: RootState) => boolean;
  selectRejectedLoading: (state: RootState) => boolean;
  selectPendingError?: (state: RootState) => string | null;
  selectApprovedError?: (state: RootState) => string | null;
  selectRejectedError?: (state: RootState) => string | null;
  selectCounts: (state: RootState) => any;
}

/**
 * Custom hook to manage dashboard tasks state
 * 
 * Usage:
 * ```tsx
 * const tasks = useDashboardTasks({
 *   selectPending: selectPendingTasks,
 *   selectApproved: selectApprovedTasks,
 *   selectRejected: selectRejectedTasks,
 *   selectPendingLoading: selectPendingTasksLoading,
 *   selectApprovedLoading: selectApprovedTasksLoading,
 *   selectRejectedLoading: selectRejectedTasksLoading,
 *   selectCounts: selectTaskCounts,
 * });
 * ```
 */
export const useDashboardTasks = (config: UseDashboardTasksConfig): UseDashboardTasksReturn => {
  const pending = useSelector(config.selectPending);
  const approved = useSelector(config.selectApproved);
  const rejected = useSelector(config.selectRejected);
  
  const pendingLoading = useSelector(config.selectPendingLoading);
  const approvedLoading = useSelector(config.selectApprovedLoading);
  const rejectedLoading = useSelector(config.selectRejectedLoading);
  
  const pendingError = useSelector(config.selectPendingError ?? (() => null));
  const approvedError = useSelector(config.selectApprovedError ?? (() => null));
  const rejectedError = useSelector(config.selectRejectedError ?? (() => null));
  
  const counts = useSelector(config.selectCounts);

  // Memoize computed values
  const data = useMemo(
    () => ({
      pending,
      approved,
      rejected,
      counts,
    }),
    [pending, approved, rejected, counts]
  );

  const loading = useMemo(
    () => ({
      overall: pendingLoading || approvedLoading || rejectedLoading,
      pending: pendingLoading,
      approved: approvedLoading,
      rejected: rejectedLoading,
    }),
    [pendingLoading, approvedLoading, rejectedLoading]
  );

  const error = useMemo(
    () => ({
      overall: pendingError || approvedError || rejectedError,
      pending: pendingError || null,
      approved: approvedError || null,
      rejected: rejectedError || null,
    }),
    [pendingError, approvedError, rejectedError]
  );

  const isEmpty = useMemo(
    () => pending.length === 0 && approved.length === 0 && rejected.length === 0,
    [pending, approved, rejected]
  );

  const hasError = useMemo(
    () => !!error.overall,
    [error.overall]
  );

  return {
    data,
    loading,
    error,
    isEmpty,
    hasError,
  };
};

/**
 * Simplified version for single task type
 */
export const useSingleTaskType = <T extends any[]>(
  selectTasks: (state: RootState) => T,
  selectLoading: (state: RootState) => boolean,
  selectError?: (state: RootState) => string | null
) => {
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError ?? (() => null));

  return useMemo(
    () => ({
      tasks,
      loading,
      error: error || null,
      isEmpty: tasks.length === 0,
    }),
    [tasks, loading, error]
  );
};
