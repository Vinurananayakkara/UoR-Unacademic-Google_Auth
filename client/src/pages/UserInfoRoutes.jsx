// UserInfoRoutes.jsx
import { Routes, Route ,Navigate } from 'react-router-dom';
import { UserInfoProvider } from '../context/UserInfoContext.jsx';

import Form1 from './Forms/Form1.jsx';
import Form2 from './Forms/Form2.jsx';
import UserInfoPage from './UserInfoPage';

const UserInfoRoutes = () => {
  return (
    <UserInfoProvider>
      <Routes>

        <Route path="/" element={<Navigate to="form1" replace />} />


        <Route path="form1" element={<Form1 />} />
        <Route path="form2" element={<Form2 />} />
        <Route path="submit" element={<UserInfoPage />} />
        
      </Routes>
    </UserInfoProvider>
  );
};

export default UserInfoRoutes;
