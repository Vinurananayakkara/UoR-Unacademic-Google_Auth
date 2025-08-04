import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';

const createEmptyRow = () => ({ subject: '', grade: '' });

const Form3 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  // Set defaults if not available
  const updateOL = (attempt, index, key, value) => {
    const updated = [...(formData.ol?.[attempt] || [createEmptyRow()])];
    updated[index][key] = value;
    setFormData({ ...formData, ol: { ...formData.ol, [attempt]: updated } });
  };

  const updateAL = (attempt, index, key, value) => {
  const updated = [...(formData.al?.[attempt] || [createEmptyRow()])];
  updated[index][key] = value;
  setFormData({ ...formData, al: { ...formData.al, [attempt]: updated } });
};

    

  const addRow = (type, attempt = null) => {
    if (type === 'ol') {
      const updated = [...(formData.ol?.[attempt] || [])];
      updated.push(createEmptyRow());
      setFormData({ ...formData, ol: { ...formData.ol, [attempt]: updated } });
    } else if (type === 'al') {
    const updated = [...(formData.al?.[attempt] || [])];
    updated.push(createEmptyRow());
    setFormData({ ...formData, al: { ...formData.al, [attempt]: updated } });
  }
};

    // Add new schools_Attended row
  const addSchools_AttendedRow = () => {
    const updated = [...(formData.schools_Attended || [])];
    updated.push({ name_of_school: "", from: "", to: ""});
    setFormData({ ...formData, schools_Attended: updated });
  };

  // Add new university row
  const addUniversityRow = () => {
    const updated = [...(formData.university || [])];
    updated.push({ institute: "", type: "", year: "", class: "", date: "" });
    setFormData({ ...formData, university: updated });
  };

  const addProfessionalRow = () => {
    const updated = [...(formData.professional || [])];
    updated.push({ institute: "", course: "", from: "", to: "",date: ""});
    setFormData({ ...formData, professional: updated });
  };

  const addOtherEducationRow = () => {
    const updated = [...(formData.other_education || [])];
    updated.push({ institute: "", course: "", from: "", to: "", date: "" });
    setFormData({ ...formData, other_education: updated });
  };

  const addOtherRow = () => {
    const updated = [...(formData.other || [])];
    updated.push({ qualification: "", year: "" });
    setFormData({ ...formData, other: updated });
  };

  const addSportsRow = () => {
    const updated = [...(formData.sports || [])];
    updated.push({ activity: "", year: "", award: "" });
    setFormData({ ...formData, sports: updated });
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



  const handleNext = () => {

    navigate('/profile/form4');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <Stepper currentStep={2} />
        <h2 className="text-xl font-semibold mb-6 text-center">Step 2: Educational Qualifications</h2>

        <div>
            <h3 className="text-lg font-bold mb-2">Schools Attended</h3>
            
            <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black">Name Of School</th>
              <th className="border border-black">From</th>
              <th className="border border-black">To</th>
            
            </tr>
          </thead>
          {renderInputRow(formData.schools_Attended, 'schools_Attended', addSchools_AttendedRow)}
        </table>
        <button onClick={addSchools_AttendedRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

          </div>
          </div>

        {/* O/L First Attempt */}
        <h3 className="block font-medium mb-1">G.C.E. (O/L) - First Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.ol_year_1 || ''}
              onChange={(e) => setFormData({ ...formData, ol_year_1: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.ol_index_1 || ''}
              onChange={(e) => setFormData({ ...formData, ol_index_1: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.ol?.firstAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateOL('firstAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--Mathematics--'
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateOL('firstAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--A--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('ol', 'firstAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* O/L Second Attempt */}
        <h3 className="block font-medium mb-1">G.C.E. (O/L) - Second Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.ol_year_2 || ''}
              onChange={(e) => setFormData({ ...formData, ol_year_2: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.ol_index_2 || ''}
              onChange={(e) => setFormData({ ...formData, ol_index_2: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.ol?.secondAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateOL('secondAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateOL('secondAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--B--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('ol', 'secondAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* O/L Third Attempt */}
        <h3 className="block font-medium mb-1">G.C.E. (O/L) - Third Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.ol_year_3 || ''}
              onChange={(e) => setFormData({ ...formData, ol_year_3: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.ol_index_3 || ''}
              onChange={(e) => setFormData({ ...formData, ol_index_3: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.ol?.thirdAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateOL('thirdAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateOL('thirdAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--B--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('ol', 'thirdAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* A/L First Attempt*/}
        <h3 className="block font-medium mb-1">G.C.E. (A/L) - First Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.al_year_1 || ''}
              onChange={(e) => setFormData({ ...formData, al_year_1: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.al_index_1 || ''}
              onChange={(e) => setFormData({ ...formData, al_index_1: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.firstAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateAL('firstAttempt',index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--Physics--'
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateAL('firstAttempt',index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--A--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('al','firstAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

         {/* A/L Second Attempt*/}
        <h3 className="block font-medium mb-1">G.C.E. (A/L) - Second Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.al_year_2 || ''}
              onChange={(e) => setFormData({ ...formData, al_year_2: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.al_index_2 || ''}
              onChange={(e) => setFormData({ ...formData, al_index_2: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.secondAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateAL('secondAttempt',index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--Physics--'
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateAL('secondAttempt',index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--A--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('al','secondAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

         {/* A/L Third Attempt*/}
        <h3 className="block font-medium mb-1">G.C.E. (A/L) - Third Attempt</h3>
        <div>
            <label className="block font-medium mb-1">Year.</label>
            <input
              type="text"
              value={formData.al_year_3 || ''}
              onChange={(e) => setFormData({ ...formData, al_year_3: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--2023--'
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Index No.</label>
            <input
              type="text"
              value={formData.al_index_3 || ''}
              onChange={(e) => setFormData({ ...formData, al_index_3: e.target.value })}
              className="w-full px-3 py-2 border rounded" placeholder='--123456789--'
            />
          </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.thirdAttempt || [createEmptyRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.subject}
                      onChange={(e) => updateAL('thirdAttempt',index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--Physics--'
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.grade}
                      onChange={(e) => updateAL('thirdAttempt',index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded" placeholder='--A--'
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('al','thirdAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* Additional Qualifications */}
       
        
          
          <div>
            <h3 className="block font-medium mb-1">Professional Qualifications</h3>
            <table className="table-auto w-full border mb-2">
            <thead>
              <tr>
                <th className="border border-black">Institution</th>
                <th className="border border-black">Course</th>
                <th className="border border-black">From</th>
                <th className="border border-black">To</th>
                <th className="border border-black">Effective Date</th>
              </tr>
            </thead>
            {renderInputRow(formData.professional, 'professional', addProfessionalRow)}
            </table>
            <button onClick={addProfessionalRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>
          </div>

          <div>  
          <h3 className="block font-medium mb-1">University Education</h3>
          <table className="table-auto w-full border mb-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black">Institute</th>
              <th className="border border-black">Degree/Diploma</th>
              <th className="border border-black">Year</th>
              <th className="border border-black">Class</th>
              <th className="border border-black">Effective Date</th>
            </tr>
          </thead>
          {renderInputRow(formData.university, 'university', addUniversityRow)}
        </table>
        <button onClick={addUniversityRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

        </div>

          
          <div>
            <label className="block font-medium mb-1">Other Eductional Qualifications</label>
            
            <table className="table-auto w-full border mb-2">
          <thead>
            <tr>
              <th className="border border-black">Qualification</th>
              <th className="border border-black">Institution</th>
              <th className="border border-black">From</th>
              <th className="border border-black">To</th>
              <th className="border border-black">Effective Date</th>
            </tr>
          </thead>
          {renderInputRow(formData.other_education, 'other_education', addOtherEducationRow)}
        </table>
        <button onClick={addOtherEducationRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

          </div>

          <div>
            <label className="block font-medium mb-1">Other Qualifications</label>
              
              <table className="table-auto w-full border mb-2">
          <thead>
            <tr>
              <th className="border border-black">Qualification</th>
              <th className="border border-black">Year</th>
            </tr>
          </thead>
          {renderInputRow(formData.other, 'other', addOtherRow)}
        </table>
        <button onClick={addOtherRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>

          </div>

          <div>
            <label className="block font-medium mb-1">Sports Qualifications</label>
            <table className="table-auto w-full border mb-2">
          <thead>
            <tr>
              <th className="border border-black">Activity</th>
              <th className="border border-black">Year</th>
              <th className="border border-black">Award</th>
            </tr>
          </thead>
          {renderInputRow(formData.sports, 'sports', addSportsRow)}
        </table>
        <button onClick={addSportsRow} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">+ Add Row</button>
          </div>

       

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={() => navigate('/profile/form2')}
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


export default Form3;
