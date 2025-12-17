import type { RootState } from "../../app/store";

export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserList = (state: RootState) => state.user.users;
