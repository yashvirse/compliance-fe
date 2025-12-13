import type { RootState } from '../../../app/store';

// Task counts selectors
export const selectReviewerTaskCounts = (state: RootState) =>
  state.reviewerDashboard.counts;

export const selectReviewerPendingCount = (state: RootState) =>
  state.reviewerDashboard.counts?.pendingCount ?? 0;

export const selectReviewerApprovedCount = (state: RootState) =>
  state.reviewerDashboard.counts?.approvedCount ?? 0;

export const selectReviewerRejectedCount = (state: RootState) =>
  state.reviewerDashboard.counts?.rejectedCount ?? 0;

// Task actions selectors
export const selectReviewerTaskActionsLoading = (state: RootState) =>
  state.reviewerDashboard.taskActionsLoading;

export const selectReviewerTaskActionsError = (state: RootState) =>
  state.reviewerDashboard.taskActionsError;

// Pending review tasks selectors
export const selectPendingReviewTasks = (state: RootState) =>
  state.reviewerDashboard.pendingReviewTasks;

export const selectPendingReviewTasksLoading = (state: RootState) =>
  state.reviewerDashboard.pendingReviewTasksLoading;

export const selectPendingReviewTasksError = (state: RootState) =>
  state.reviewerDashboard.pendingReviewTasksError;

// Approved review tasks selectors
export const selectApprovedReviewTasks = (state: RootState) =>
  state.reviewerDashboard.approvedReviewTasks;

export const selectApprovedReviewTasksLoading = (state: RootState) =>
  state.reviewerDashboard.approvedReviewTasksLoading;

export const selectApprovedReviewTasksError = (state: RootState) =>
  state.reviewerDashboard.approvedReviewTasksError;

// Rejected review tasks selectors
export const selectRejectedReviewTasks = (state: RootState) =>
  state.reviewerDashboard.rejectedReviewTasks;

export const selectRejectedReviewTasksLoading = (state: RootState) =>
  state.reviewerDashboard.rejectedReviewTasksLoading;

export const selectRejectedReviewTasksError = (state: RootState) =>
  state.reviewerDashboard.rejectedReviewTasksError;
