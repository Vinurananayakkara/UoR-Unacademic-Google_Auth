import React from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserInfo } from '../context/UserInfoContext.jsx';


function UserInfoPage() {
  const navigate = useNavigate();
  const {formData} = useUserInfo();

    const handleSubmit = async () => {
    try {
      await axios.post('/auth/add-info', formData); // ❌ no email
      toast.success('Info submitted!');
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Failed to submit.');
    }
  };

    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Review & Submit</h2>
          <ul className="mb-4 text-sm">
            <li><strong>Name:</strong> {formData.name}</li>
            <li><strong>Age:</strong> {formData.age}</li>
            <li><strong>Gender:</strong> {formData.gender}</li>
            <li><strong>Country:</strong> {formData.country}</li>
          </ul>

          <div className="flex justify-between">
            <button onClick={() => navigate('/step2')} className="bg-gray-400 text-white px-4 py-2 rounded">
              Back
            </button>
            <button onClick={handleSubmit} className="bg-purple-600 text-white px-6 py-2 rounded">
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

export default UserInfoPage;