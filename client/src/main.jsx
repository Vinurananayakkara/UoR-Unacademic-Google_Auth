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
import FileUpload from './pages/Forms/FileUpload.jsx';
import FileSubmissionPage from './pages/Forms/FileSubmissionPage.jsx';
import FileList from './pages/Forms/FileList.jsx';
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
          <Route path="/profile/file-upload" element={<FileUpload />} />
          <Route path="/profile/file-submission" element={<FileSubmissionPage />} />
          <Route path="/profile/file-list" element={<FileList />} />
          
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
