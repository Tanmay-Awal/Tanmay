import { configureStore } from '@reduxjs/toolkit';
import signupReducer from './signupSlice.jsx';
import authReducer from "./authSlice";
import activityReducer from "./Applicant/activitySlice.js";
import applicationsReducer from "./Applicant/applicationsSlice.js";
import tasksReducer from "./Applicant/tasksSlice.js";
import notificationsReducer from "./Applicant/notificationsSlice.js";
import opportunitiesReducer from "./Applicant/opportunitiesSlice.js";
import profileReducer from "./Applicant/profileSlice.js";
import settingsReducer from "./Applicant/settingsSlice.js";






import ngoOpportunitiesReducer from "./NGO/Ngo_opportunitiesSlice";
import ngoApplicationsReducer from "./NGO/Ngo_applicationsSlice";
import ngoNotificationsReducer from "./NGO/Ngo_notificationsSlice";
import ngoProfileReducer from "./NGO/Ngo_profileSlice";
import ngoSettingsReducer from "./NGO/Ngo_settingsSlice";
import ngoReportsReducer from "./NGO/Ngo_reportsSlice";
import Ngo_tasksReducer from './NGO/Ngo_tasksSlice';



const store = configureStore({
  reducer: {
    signup: signupReducer,
    auth: authReducer,
    activity: activityReducer,
    applications: applicationsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
    opportunities: opportunitiesReducer,
    profile: profileReducer,
    settings: settingsReducer,

    
    ngo_opportunities: ngoOpportunitiesReducer,
    ngoApplications: ngoApplicationsReducer,
    ngoNotifications: ngoNotificationsReducer,
    ngoProfile: ngoProfileReducer,
    ngoSettings: ngoSettingsReducer,
    ngoReports: ngoReportsReducer,
    ngoTasks: Ngo_tasksReducer,


  },
});

export default store;
