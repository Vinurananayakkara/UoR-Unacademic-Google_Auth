import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx';
import Stepper from './Stepper';
import React from 'react';
import SchoolsAttendedTable from './Tables/SchoolsAttendedTable.jsx';
import UniversityTable from './Tables/UniversityTable.jsx';
import OtherEducationTable from './Tables/OtherEducationTable.jsx';
import ProfessionalQualificationsTable from './Tables/ProfessionalQualificationsTable.jsx';
import OtherQualificationsTable from './Tables/OtherQualificationsTable.jsx';
import SportsTable from './Tables/SportsTable.jsx';

const Form3 = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useUserInfo();

  const AL_STREAMS = [
    { value: '', label: '-- Select Stream --' },
    { value: 'Science', label: 'Science' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Technology', label: 'Technology' },
  ];

  const AL_SUBJECTS = {
    Science: [
      'Physics', 'Chemistry', 'Biology', 'Combined Mathematics', 'Agriculture', 'ICT'
    ],
    Commerce: [
      'Accounting', 'Business Studies', 'Economics', 'Business Statistics', 'ICT'
    ],
    Arts: [
      'Sinhala', 'Political Science', 'Geography', 'Logic', 'Buddhism', 'History', 'ICT'
    ],
    Technology: [
      'Engineering Technology', 'Science for Technology', 'Bio System Technology', 'ICT'
    ],
  };

  const GRADE_OPTIONS = ['', 'A', 'B', 'C', 'S', 'F'];

const createEmptySubjectRow = () => ({ subject: '', grade: '' });


  // ...existing code...

const addRow = (exam, attempt) => {
  if (exam === 'ol') {
    const updated = [...(formData.ol?.[attempt] || [])];
    updated.push({ subject: '', grade: '' });
    setFormData({ ...formData, ol: { ...formData.ol, [attempt]: updated } });
  } else if (exam === 'al') {
    const updated = [...(formData.al?.[attempt] || [])];
    updated.push({ subject: '', grade: '' });
    setFormData({ ...formData, al: { ...formData.al, [attempt]: updated } });
  }
};

// ...existing code...

  // Set defaults if not available
  const updateOL = (attempt, index, key, value) => {
    const updated = [...(formData.ol?.[attempt] || [createEmptySubjectRow()])];
    updated[index][key] = value;
    setFormData({ ...formData, ol: { ...formData.ol, [attempt]: updated } });
  };

  const updateAL = (attempt, index, key, value) => {
    const updated = [...(formData.al?.[attempt] || [createEmptySubjectRow()])];
    updated[index][key] = value;
    setFormData({ ...formData, al: { ...formData.al, [attempt]: updated } });
  };

  // Local state for each section, initialized from context

  // Save all to context before next step
  const handleNext = () => {
    
    navigate('/profile/form4');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl">
        <Stepper currentStep={2} />
        <h2 className="text-xl font-semibold mb-6 text-center">Step 2: Educational Qualifications</h2>

        <SchoolsAttendedTable />

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
              {(formData.ol?.firstAttempt || [createEmptySubjectRow()]).map((row, index) => (
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
              {(formData.ol?.secondAttempt || [createEmptySubjectRow()]).map((row, index) => (
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
              {(formData.ol?.thirdAttempt || [createEmptySubjectRow()]).map((row, index) => (
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

        {/* A/L First Attempt */}
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
        <label className="block font-medium mb-1">Stream</label>
        <select
          value={formData.al_stream_1 || ''}
          onChange={e => setFormData({ ...formData, al_stream_1: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        >
          {AL_STREAMS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.firstAttempt || [createEmptySubjectRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <select
                      value={row.subject}
                      onChange={e => updateAL('firstAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">-- Select Subject --</option>
                      {(AL_SUBJECTS[formData.al_stream_1] || []).map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <select
                      value={row.grade}
                      onChange={e => updateAL('firstAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>{g || '-- Select Grade --'}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('al','firstAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* A/L Second Attempt */}
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
        <label className="block font-medium mb-1">Stream</label>
        <select
          value={formData.al_stream_2 || ''}
          onChange={e => setFormData({ ...formData, al_stream_2: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        >
          {AL_STREAMS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.secondAttempt || [createEmptySubjectRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <select
                      value={row.subject}
                      onChange={e => updateAL('secondAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">-- Select Subject --</option>
                      {(AL_SUBJECTS[formData.al_stream_2] || []).map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <select
                      value={row.grade}
                      onChange={e => updateAL('secondAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>{g || '-- Select Grade --'}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRow('al','secondAttempt')} className="bg-blue-400 text-white px-4 py-1 rounded w-full sm:w-auto hover:bg-blue-500">
            + Add Subject
          </button>
        </div>

        {/* A/L Third Attempt */}
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
        <label className="block font-medium mb-1">Stream</label>
        <select
          value={formData.al_stream_3 || ''}
          onChange={e => setFormData({ ...formData, al_stream_3: e.target.value })}
          className="w-full px-3 py-2 border rounded mb-2"
        >
          {AL_STREAMS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border mb-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-1 border">Subject</th>
                <th className="px-2 py-1 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {(formData.al?.thirdAttempt || [createEmptySubjectRow()]).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <select
                      value={row.subject}
                      onChange={e => updateAL('thirdAttempt', index, 'subject', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="">-- Select Subject --</option>
                      {(AL_SUBJECTS[formData.al_stream_3] || []).map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <select
                      value={row.grade}
                      onChange={e => updateAL('thirdAttempt', index, 'grade', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {GRADE_OPTIONS.map(g => (
                        <option key={g} value={g}>{g || '-- Select Grade --'}</option>
                      ))}
                    </select>
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
          <ProfessionalQualificationsTable />
        </div>

        <div>
          <UniversityTable />
        </div>

        <div>
          <OtherEducationTable />
        </div>

        <div>
            <OtherQualificationsTable />
        </div>

        <div>
          <SportsTable />
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