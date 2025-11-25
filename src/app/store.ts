import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../pages/login/slice/Login.slice";
import companyReducer from "../pages/master/company/slice/Company.Slice";
import actMasterReducer from "../pages/master/act/slice/Act.Slice";
import departmentMasterReducer from "../pages/master/department/slice/Department.Slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companyReducer,
    actMaster: actMasterReducer,
    departmentMaster: departmentMasterReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
