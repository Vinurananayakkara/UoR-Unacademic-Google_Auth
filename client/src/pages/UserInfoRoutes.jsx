// UserInfoRoutes.jsx
import { Routes, Route ,Navigate } from 'react-router-dom';
import { UserInfoProvider } from '../context/UserInfoContext.jsx';

import Form1 from './Forms/Form1.jsx';
import Form2 from './Forms/Form2.jsx';
import Form3 from './Forms/Form3.jsx';
import Form4 from './Forms/Form4.jsx';
import Form5 from './Forms/Form5.jsx';
import UserInfoPage from './UserInfoPage';

const UserInfoRoutes = () => {
  return (
    <UserInfoProvider>
      <Routes>

        <Route path="/" element={<Navigate to="form1" replace />} />


        <Route path="form1" element={<Form1 />} />
        <Route path="form2" element={<Form2 />} />
        <Route path="form3" element={<Form3 />} />
        <Route path="form4" element={<Form4 />} />
        <Route path="form5" element={<Form5 />} />
        <Route path="submit" element={<UserInfoPage />} />
        
      </Routes>
    </UserInfoProvider>
  );
};

export default UserInfoRoutes;
