import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';

const Form4 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const handleNext = () => {
    
    navigate('/profile/form5');
  };

  const addGradeRow = () => {
    const updated = [...(formData.postGrades || [])];
    updated.push({ grade: '', date: '' });
    setFormData({ ...formData, postGrades: updated });
  };

  const updateGradeRow = (index, key, value) => {
    const updated = [...(formData.postGrades || [])];
    updated[index][key] = value;
    setFormData({ ...formData, postGrades: updated });
  };

    // Add new presentOccupation row
  const addpresentOccupationRow = () => {
    const updated = [...(formData.presentOccupation || [])];
    updated.push({ post: "", place: "", jobStatus: "", salaryScale: "", basicSalary: "" });
    setFormData({ ...formData, presentOccupation: updated });
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
        <Stepper currentStep={3} />
        <h2 className="text-xl font-semibold mb-6 text-center">Step 3: EMPLOYMENT RECORDS</h2>


          <div>
            <h3 className="text-lg font-bold mb-2">Present Occupations</h3>
            
          <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black">Post</th>
              <th className="border border-black">Place of Work</th>
              <th className="border border-black">Job Status (Contract/Temporary/Permanent/Unconfirmed) </th>
              <th className="border border-black">Salary Scale</th>
              <th className="border border-black">Basic Salary</th>
            </tr>
          </thead>
          {renderInputRow(formData.presentOccupation, 'presentOccupation', addpresentOccupationRow)}
        </table>
        <button onClick={addpresentOccupationRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

          </div>
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
            <h3 className="text-lg font-bold mb-2">Grades in Above Post</h3>
            <div className="overflow-x-auto mb-4">
              <table className="table-auto w-full border mb-2">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 border">Grade</th>
                    <th className="px-2 py-1 border">Date of Appointment</th>
                  </tr>
                </thead>
                <tbody>
                  {(formData.postGrades || []).map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={row.grade}
                          onChange={(e) => updateGradeRow(index, 'grade', e.target.value)}
                          className="w-full px-2 py-1 border rounded" placeholder='--Grade--'
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => updateGradeRow(index, 'date', e.target.value)}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addGradeRow} className="bg-blue-400 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-blue-500">
                + Add Row
              </button>
            </div>
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
