import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx'

const Form2 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleNext = () => {
    const { date, type } = formData;
    if (!date || !type) {
      alert('Please select Advertising Date and Application Type.');
      return;
    }
      // const route = `/profile/form2-${date}-${type}`;
      // navigate(route);

      navigate('/profile/submit');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Step 2: Additional Info</h2>
        <select
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
          <option value="">Select the Advertisement listed Date</option>
          <option value="saturday">Saterday</option>
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
        </select>

        <select
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        >
          <option value="">Select Application Type</option>
          <option value="internal">Internal Application</option>
          <option value="external">External Application</option>
          
        </select>

        <div className="flex justify-between">
          <button
            onClick={() => navigate('/profile/form1')}
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
