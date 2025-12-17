import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../pages/login/slice/Login.Slice";
import companyReducer from "../pages/master/company/slice/Company.Slice";
import actMasterReducer from "../pages/master/act/slice/Act.Slice";
import departmentMasterReducer from "../pages/master/department/slice/Department.Slice";
import activityMasterReducer from "../pages/master/activity/slice/Activity.Slice";
import customerAdminActivityReducer from "../pages/master/customeradminactivity/slice/CustomerAdminActivity.Slice";
import customerAdminUserReducer from "../pages/master/customeradminuser/slice/CustomerAdminUser.Slice";
import siteReducer from "../pages/master/site/slice/Site.Slice";
import makerDashboardReducer from "../pages/dashboards/makerslice/MakerDashboard.Slice";
import checkerDashboardReducer from "../pages/dashboards/checkerslice/CheckerDashboard.Slice";
import reviewerDashboardReducer from "../pages/dashboards/reviewerslice/ReviewerDashboard.Slice";
import auditorDashboardReducer from "../pages/dashboards/auditorslice/AuditorDashboard.Slice";
import userReducer from "../pages/master/UserPage.slice";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    company: companyReducer,
    actMaster: actMasterReducer,
    departmentMaster: departmentMasterReducer,
    activityMaster: activityMasterReducer,
    customerAdminActivity: customerAdminActivityReducer,
    customerAdminUser: customerAdminUserReducer,
    site: siteReducer,
    makerDashboard: makerDashboardReducer,
    checkerDashboard: checkerDashboardReducer,
    reviewerDashboard: reviewerDashboardReducer,
    auditorDashboard: auditorDashboardReducer,
    user: userReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
