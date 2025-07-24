import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx'

const Form1 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleNext = () => {
    if (!formData.name || !formData.age) {
      alert('Please fill in all fields.');
      return;
    }
    navigate('/profile/form2');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Step 1: Basic Info</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        />
        <button onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded w-full">
          Next
        </button>
      </div>
    </div>
  );
};

export default Form1;
