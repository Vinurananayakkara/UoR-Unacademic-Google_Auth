import React, { createContext, useContext, useState } from 'react';

const UserInfoContext = createContext();

export const useUserInfo = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    country: ''
  });

  return (
    <UserInfoContext.Provider value={{ formData, setFormData }}>
      {children}
    </UserInfoContext.Provider>
  );
};
