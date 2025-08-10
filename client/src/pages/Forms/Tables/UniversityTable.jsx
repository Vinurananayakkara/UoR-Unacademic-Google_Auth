import React from 'react';
import { useUserInfo } from '../../../context/UserInfoContext.jsx';

const createEmptyRow = () => ({
  Institute: '',
  type: '',
  year: '',
  class: '',
  date: ''
});

const UniversityTable = () => {
  const { formData, setFormData } = useUserInfo();

  // Ensure university and entries exist
  const entries = formData.university?.entries || [];

  const handleChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value;

    setFormData({
      ...formData,
      university: {
        entries: updatedEntries
      }
    });
  };

  const addRow = () => {
    const updatedEntries = [...entries, createEmptyRow()];
    setFormData({
      ...formData,
      university: {
        entries: updatedEntries
      }
    });
  };

  const deleteRow = (index) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setFormData({
      ...formData,
      university: {
        entries: updatedEntries.length > 0 ? updatedEntries : [createEmptyRow()]
      }
    });
  };

  return (
    <div className="overflow-x-auto mb-4">
      <h3 className="font-semibold mb-2">University Education</h3>
      <table className="table-auto w-full border mb-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1 border">Institute</th>
            <th className="px-2 py-1 border">Degree/Diploma</th>
            <th className="px-2 py-1 border">Year</th>
            <th className="px-2 py-1 border">Class</th>
            <th className="px-2 py-1 border">Effective Date</th>
            <th className="px-2 py-1 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, index) => (
            <tr key={index}>
              {['Institute', 'type', 'year', 'class', 'date'].map((field) => (
                <td key={field} className="border p-2">
                  <input
                    type={field === 'year' ? 'number' : field === 'date' ? 'date' : 'text'}
                    value={row[field]}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  />
                </td>
              ))}
              <td className="border p-2 text-center">
                <button
                  onClick={() => deleteRow(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500"
      >
        + Add University
      </button>
    </div>
  );
};

export default UniversityTable;
