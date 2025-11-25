import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../pages/login/slice/Login.Slice";
import companyReducer from "../pages/master/company/slice/Company.Slice";
import actMasterReducer from "../pages/master/act/slice/Act.Slice";
import departmentMasterReducer from "../pages/master/department/slice/Department.Slice";
import activityMasterReducer from "../pages/master/activity/slice/Activity.Slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companyReducer,
    actMaster: actMasterReducer,
    departmentMaster: departmentMasterReducer,
    activityMaster: activityMasterReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
