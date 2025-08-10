import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';

import PastOccupationsTable from './Tables/PastOccupationsTable.jsx'

function Form5() {
  const navigate = useNavigate();


  const handleNext = () => {
    
    navigate('/profile/submit');
  };

  const handleBack = () => {
    navigate('/profile/form4');
  };

    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
      <Stepper currentStep={4} />
          <div>
            <PastOccupationsTable />
          </div>

      <div className="flex justify-between mt-6">
        <button onClick={handleBack} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Back</button>
        <button onClick={handleNext} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Review</button>
      </div>
      </div>
    </div>
  
  );
}

export default Form5;
