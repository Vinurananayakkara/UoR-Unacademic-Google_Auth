import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import OTPVerifyPage from './pages/OTPVerifyPage.jsx';
import UserInfoPage from './pages/UserInfoPage.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/verify" element={<OTPVerifyPage />} />
        <Route path="/profile" element={<UserInfoPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);