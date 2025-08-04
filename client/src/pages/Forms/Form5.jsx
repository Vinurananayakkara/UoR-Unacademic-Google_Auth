import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';

function Form5() {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    
    navigate('/profile/submit');
  };

  const handleBack = () => {
    navigate('/profile/form4');
  };

    // Add new pastOccupation row
  const addpastOccupationRow = () => {
    const updated = [...(formData.pastOccupation || [])];
    updated.push({ place: "", designation: "", from: "", to: "" });
    setFormData({ ...formData, pastOccupation: updated });
  };

    const renderInputRow = (fields, name, handler) => (
      <tbody>
        {fields?.map((row, i) => (
          <tr key={i}>
            {Object.keys(row).map((key) => (
              <td className="border border-black" key={key}>
                <input
                  value={row[key]}
                  onChange={(e) => {
                    const updated = [...fields];
                    updated[i][key] = e.target.value;
                    setFormData({ ...formData, [name]: updated });
                  }}
                  className="w-full px-1"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
      <Stepper currentStep={4} />

          <div>
            <h3 className="text-lg font-bold mb-2">Past Occupations</h3>
            
            <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black">Place of Work</th>
              <th className="border border-black">Designation</th>
              <th className="border border-black">From </th>
              <th className="border border-black">To</th>
              
            </tr>
          </thead>
          {renderInputRow(formData.pastOccupation, 'pastOccupation', addpastOccupationRow)}
        </table>
        <button onClick={addpastOccupationRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

          </div>
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
