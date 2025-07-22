import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../context/UserInfoContext.jsx';

const Form2 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleNext = () => {
    if (!formData.gender || !formData.country) {
      alert('Please select gender and country.');
      return;
    }
    navigate('/user-info/submit');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Step 2: Additional Info</h2>
        <select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        >
          <option value="">Select Country</option>
          <option value="sri_lanka">Sri Lanka</option>
          <option value="india">India</option>
          <option value="usa">United States</option>
          <option value="uk">United Kingdom</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={() => navigate('/user-info/form1')}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form2;
