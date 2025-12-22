import type { RootState } from "../../../app/store";

export const selectTaskLoading = (state: RootState) => state.task.loading;

export const selectTaskError = (state: RootState) => state.task.error;

export const selectTaskList = (state: RootState) => state.task.taskList;
