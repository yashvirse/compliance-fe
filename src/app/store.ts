import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../pages/login/slice/Login.slice";
import companyReducer from "../pages/master/company/slice/Company.Slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companyReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
