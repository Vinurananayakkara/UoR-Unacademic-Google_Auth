// UserInfoRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserInfoProvider } from './UserInfoContext';

import Form1 from './Form1';
import Form2 from './Form2';
import UserInfoPage from './UserInfoPage';

const UserInfoRoutes = () => {
  return (
    <UserInfoProvider>
      <Routes>
        <Route path="/user-info/from1" element={<Form1 />} />
        <Route path="/user-info/form2" element={<Form2 />} />
        <Route path="/user-info/submit" element={<UserInfoPage />} />
      </Routes>
    </UserInfoProvider>
  );
};

export default UserInfoRoutes;
