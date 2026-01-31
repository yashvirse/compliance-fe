/**
 * useTaskActions Hook - Consolidate task action handlers
 * Benefits: Consistent error handling, loading states, reduced duplication
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';

interface TaskActionOptions {
  onSuccess?: (message?: string) => void;
  onError?: (error: string) => void;
}

interface UseTaskActionsReturn {
  handleApprove: (taskId: string, remarks?: string) => Promise<void>;
  handleReject: (taskId: string, remarks?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Custom hook for handling task approval/rejection with consistent error handling
 * 
 * Usage:
 * ```tsx
 * const { handleApprove, handleReject, isLoading, error } = useTaskActions(
 *   approveTaskThunk,
 *   rejectTaskThunk,
 *   {
 *     onSuccess: () => console.log('Task updated'),
 *     onError: (error) => toast.error(error),
 *   }
 * );
 * ```
 */
export const useTaskActions = (
  approveAction: (payload: any) => any,
  rejectAction: (payload: any) => any,
  options?: TaskActionOptions
): UseTaskActionsReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApprove = useCallback(
    async (taskId: string, remarks?: string) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await dispatch(
          approveAction({
            taskId,
            remarks: remarks || '',
          })
        ).unwrap();

        setSuccess(true);
        options?.onSuccess?.(result?.message || 'Task approved successfully');
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to approve task';
        setError(errorMsg);
        options?.onError?.(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, approveAction, options]
  );

  const handleReject = useCallback(
    async (taskId: string, remarks?: string) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await dispatch(
          rejectAction({
            taskId,
            remarks: remarks || '',
          })
        ).unwrap();

        setSuccess(true);
        options?.onSuccess?.(result?.message || 'Task rejected successfully');
      } catch (err: any) {
        const errorMsg = err?.message || 'Failed to reject task';
        setError(errorMsg);
        options?.onError?.(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, rejectAction, options]
  );

  return {
    handleApprove,
    handleReject,
    isLoading,
    error,
    success,
  };
};

/**
 * Generic task action hook for any CRUD operation
 */
export const useCRUDTask = (
  action: (payload: any) => any,
  operationName: string = 'Operation'
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = useCallback(
    async (payload: any) => {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await dispatch(action(payload)).unwrap();
        setSuccess(true);
        return result;
      } catch (err: any) {
        const errorMsg = err?.message || `${operationName} failed`;
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, action, operationName]
  );

  return {
    execute,
    isLoading,
    error,
    success,
    reset: () => {
      setError(null);
      setSuccess(false);
    },
  };
};
