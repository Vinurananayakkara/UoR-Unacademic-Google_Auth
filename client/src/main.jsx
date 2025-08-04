import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserInfoProvider, useUserInfo } from './context/UserInfoContext.jsx';

import App from './App.jsx';
import OTPVerifyPage from './pages/OTPVerifyPage.jsx';
import UserInfoRoute from './pages/UserInfoRoutes.jsx';
import './index.css';
import AdminDashboard from './pages/Admin_pages/AdminDashboard.jsx';
import AdminUserDetail from './pages/Admin_pages/AdminUserDetail.jsx';
import ApprovedUsers from './pages/Admin_pages/ApprovedUsers.jsx';
import FinalUsers from './pages/Admin_pages/FinalUsers.jsx';
import DeletedUsers from './pages/Admin_pages/DeletedUsers.jsx';
import SettingsPage from './pages/Admin_pages/SettingsPage.jsx'; // adjust path as needed

 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserInfoProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/verify" element={<OTPVerifyPage />} />
          <Route path="/profile/*" element={<UserInfoRoute />} />
          
          <Route path="/admin/" element={<AdminDashboard />} />
          <Route path="/admin/approved" element={<ApprovedUsers />} />
          <Route path="/admin/final" element={<FinalUsers />} />
          <Route path="/admin/deleted" element={<DeletedUsers />} />
          <Route path="/admin/user/:id" element={<AdminUserDetail />} />
         <Route path="/admin/settings" element={<SettingsPage />} /> 
        </Routes>
      </UserInfoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
