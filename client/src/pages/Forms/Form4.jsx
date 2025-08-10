import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';

import PresentOccupationsTable from './Tables/PresentOccupationsTable.jsx';
import GradesOfPresentOccupationTable from './Tables/GradesOfPresentOccupationTable.jsx'

const Form4 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleNext = () => {
    
    navigate('/profile/form5');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <Stepper currentStep={3} />
        <h2 className="text-xl font-semibold mb-6 text-center">Step 3: EMPLOYMENT RECORDS</h2>

          <div>
            <PresentOccupationsTable />
          </div>

        <label>Date of got permenent of the above position (Only for confirmed and permanent positions )</label>
        <input type='date' 
        value={formData.presentOccupation_date || ''}
        onChange={(e) => setFormData({ ...formData, presentOccupation_date: e.target.value })}
        className="w-full border p-2 rounded mb-4"
        placeholder='Date of Appointment' />

        {formData.type === "Internal" && (
          <div>
            {/* Grades in above post */}
            <GradesOfPresentOccupationTable />
          </div>
        )}


        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={() => navigate('/profile/form3')}
            className="bg-gray-400 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form4;
