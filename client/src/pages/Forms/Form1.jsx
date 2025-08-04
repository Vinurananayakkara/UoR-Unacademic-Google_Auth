import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';
import axios from '../../axios.js';
import { useEffect } from 'react';

const Form1 = () => {
  const navigate = useNavigate();
  const { formData, setFormData ,availableDates, setAvailableDates ,availablePosts,setAvailablePosts } = useUserInfo();
  


  const handleNext = () => {
    const { date, type } = formData;
    if (!date || !type) {
      alert('Please select Advertisement Date Application and Type.');
      return;
    }
    navigate('/profile/form2');
  };

  useEffect(() => {
  const fetchSettings = async () => {
    const res = await axios.get('/admin/get-posts');
    // Update the structure to match your data
    const formatted = (res.data.addPosts || []).map(item => ({
      date: item.createddate,
      posts: item.createdposts,
    }));
    setAvailableDates(formatted);
  };
  

  fetchSettings();
 
}, []);

const handleDateChange = (e) => {
  const selectedDate = e.target.value;
  setFormData({ ...formData, date: selectedDate, post: '' });

  const matched = availableDates.find((entry) => entry.date === selectedDate);
  setAvailablePosts(matched ? matched.posts : []);
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <Stepper currentStep={0} />
        <h2 className="text-xl font-semibold mb-4 text-center">Step 1: Advertisement Details</h2>
        
        <label className="block mb-1">Select the Advertisement Enlistment Date</label>
        <select
          value={formData.date}
          onChange={handleDateChange}

          className={`border px-4 py-2 rounded mb-3 w-full` }
        >
          <option value="">--Select--</option>
          {availableDates.map((entry, idx) => (
            <option key={idx} value={entry.date}>
              {entry.date}
            </option>
        ))}
          
        </select>
        

        <label className="block mb-1">Select the Application Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        >
          <option value="">--Select--</option>
          <option value="Internal">Internal Application</option>
          <option value="External">External Application</option>
        </select>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form1;
