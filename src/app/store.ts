import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../pages/login/slice/Login.Slice";
import companyReducer from "../pages/master/company/slice/Company.Slice";
import actMasterReducer from "../pages/master/act/slice/Act.Slice";
import departmentMasterReducer from "../pages/master/department/slice/Department.Slice";
import activityMasterReducer from "../pages/master/activity/slice/Activity.Slice";
import customerAdminActivityReducer from "../pages/master/customeradminactivity/slice/CustomerAdminActivity.Slice";
import customerAdminUserReducer from "../pages/master/customeradminuser/slice/CustomerAdminUser.Slice";
import makerDashboardReducer from "../pages/dashboards/slice/MakerDashboard.Slice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companyReducer,
    actMaster: actMasterReducer,
    departmentMaster: departmentMasterReducer,
    activityMaster: activityMasterReducer,
    customerAdminActivity: customerAdminActivityReducer,
    customerAdminUser: customerAdminUserReducer,
    makerDashboard: makerDashboardReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
