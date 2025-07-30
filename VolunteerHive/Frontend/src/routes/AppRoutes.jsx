import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "../components/Landing.jsx";
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";
import NgoSetup from "../components/NgoSetup.jsx";
import VolunteerDashboard from "../pages/Applicant/VolunteerDashboard.jsx";
import VolunteerProfile from "../pages/Applicant/VolunteerProfile.jsx";
import Activity from "../pages/Applicant/Activity.jsx";
import Applications from "../pages/Applicant/MyApplications.jsx";
import Tasks from "../pages/Applicant/MyTasks.jsx";
import Notifications from "../pages/Applicant/Notifications.jsx";
import Settings from "../pages/Applicant/Settings.jsx";
import Opportunities from "../pages/Applicant/Opportunities.jsx";
import NgoDashboard from "../pages/NGO/NgoDashboard.jsx";
import NgoProfile from "../pages/NGO/NgoProfile.jsx";
import NgoReports from "../pages/NGO/NgoReports.jsx";
import NgoSettings from "../pages/NGO/NgoSettings.jsx";
import NgoOpportunities from "../pages/NGO/NgoOpportunities.jsx";
import NgoApplications from "../pages/NGO/NgoApplications.jsx";
import NgoNotifications from "../pages/NGO/NgoNotifications.jsx";
import AddOpportunity from "../pages/NGO/AddOpportunity.jsx";
import EditOpportunity from "../pages/NGO/EditOpportunity.jsx";
import ViewOpportunity from "../pages/NGO/ViewOpportunity.jsx";
import ApplyOpportunity from "../pages/Applicant/ApplyOpportunity.jsx";
import ViewApplications from "../pages/NGO/ViewApplications.jsx";
import TaskDetails from "../pages/Applicant/TaskDetails.jsx";
import Track from "../pages/NGO/VolunteerProgressTracker.jsx";
import NgoVerifyTask from "../pages/NGO/NgoVerifyTask.jsx";
import FloatingDashboardFAB from '../components/FloatingDashboardFAB';
import Unauthorized from '../components/Unauthorized';
import ForgotPassword from '../components/ForgotPassword.jsx';
import ResetPassword from '../components/ResetPassword.jsx';

const routeConfig = [
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/ngo-setup", element: <NgoSetup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  // Volunteer routes (user)
  { path: "/volunteer-dashboard", element: <VolunteerDashboard />, protected: true, roles: ["user"] },
  { path: "/volunteer-profile", element: <VolunteerProfile />, protected: true, roles: ["user"] },
  { path: "/activity", element: <Activity />, protected: true, roles: ["user"] },
  { path: "/applications", element: <Applications />, protected: true, roles: ["user"] },
  { path: "/tasks", element: <Tasks />, protected: true, roles: ["user"] },
  { path: "/notifications", element: <Notifications />, protected: true, roles: ["user"] },
  { path: "/settings", element: <Settings />, protected: true, roles: ["user"] },
  { path: "/opportunities", element: <Opportunities />, protected: true, roles: ["user"] },
  { path: "/apply-opportunity/:id", element: <ApplyOpportunity />, protected: true, roles: ["user"] },
  { path: "/task-details/:id", element: <TaskDetails />, protected: true, roles: ["user"] },
  // NGO routes (admin)
  { path: "/ngo-dashboard", element: <NgoDashboard />, protected: true, roles: ["admin"] },
  { path: "/ngo-profile", element: <NgoProfile />, protected: true, roles: ["admin"] },
  { path: "/ngo-reports", element: <NgoReports />, protected: true, roles: ["admin"] },
  { path: "/ngo-settings", element: <NgoSettings />, protected: true, roles: ["admin"] },
  { path: "/ngo-opportunities", element: <NgoOpportunities />, protected: true, roles: ["admin"] },
  { path: "/ngo-applications", element: <NgoApplications />, protected: true, roles: ["admin"] },
  { path: "/ngo-notifications", element: <NgoNotifications />, protected: true, roles: ["admin"] },
  { path: "/add-opportunity", element: <AddOpportunity />, protected: true, roles: ["admin"] },
  { path: "/edit-opportunity/:id", element: <EditOpportunity />, protected: true, roles: ["admin"] },
  { path: "/view-opportunity/:id", element: <ViewOpportunity />, protected: true, roles: ["admin"] },
  { path: "/view-applications/:appId/:oppId", element: <ViewApplications />, protected: true, roles: ["admin"] },
  { path: "/ngo-track", element: <Track />, protected: true, roles: ["admin"] },
  { path: "/ngo-verify-task/:id", element: <NgoVerifyTask />, protected: true, roles: ["admin"] },
  // Unauthorized route
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <Unauthorized /> },
];

function AppRoutes() {
  const location = useLocation();
  
  const currentPath = location.pathname.toLowerCase();
  const forceHideFAB = 
    currentPath === '/' ||
    currentPath.startsWith('/login') ||
    currentPath.startsWith('/signup') ||
    currentPath.startsWith('/ngo-setup') ||
    currentPath.startsWith('/volunteer-dashboard') ||
    currentPath.startsWith('/ngo-dashboard') ||
    currentPath.startsWith('/unauthorized') ||
    currentPath.startsWith('/forgot-password') ||
    currentPath.startsWith('/reset-password');

  const user_role = localStorage.getItem('auth_role');
  const access_token = localStorage.getItem('access_token');

  return (
    <>
      <Routes>
        {routeConfig.map((route, idx) => {
          console.log('Debug info:', {
            path: route.path,
            protected: route.protected,
            access_token: access_token,
            user_role: user_role,
            roles: route.roles,
            includes_role: route.roles?.includes(user_role)
          });
          if (route.protected) {
            if (!access_token || !route.roles.includes(user_role)) {
              return <Route key={idx} path={route.path} element={<Unauthorized />} />;
            }
          }
          return <Route key={idx} path={route.path} element={route.element} />;
        })}
      </Routes>
      {!forceHideFAB && <FloatingDashboardFAB />}
    </>
  );
}

export default AppRoutes;