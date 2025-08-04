import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';


import '../../index.css'; // Ensure your styles are imported

function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/admin/users/${id}`, { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        toast.error('Failed to fetch user details');
      }
    };
    fetchUser();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.post(`/admin/users/${id}/approve`, {}, { withCredentials: true });
      toast.success('User approved');
      navigate('/admin');
    } catch (err) {
      toast.error('Approval failed');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`/admin/users/${id}/soft-delete`, {}, { withCredentials: true });

      toast.success('User deleted');
      navigate('/admin');
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  const handleFinalize = async () => {
  try {
    await axios.post(`/admin/users/${id}/finalize`, {}, { withCredentials: true });
    toast.success('User finalized');
    navigate('/admin');
  } catch (err) {
    toast.error('Finalization failed');
  }
};
const underlineField = (value, width = 'w-[30%]') => (
  <span
    className={`inline-block ml-2 ${width} underline-field`}
    style={{
      borderBottom: '1px solid black',
      lineHeight: '1.4em',
      paddingBottom: '2px',
      minHeight: '1.4em',
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}
  >
    {value || '\u00A0'}
  </span>
);



  if (!user) return <p className="text-center mt-10">Loading user...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
  <h2 className="text-2xl font-bold mb-6 text-center">User Full Application</h2>
      <p className='space-y-12'><strong>Application Type:</strong> {underlineField(user.type)}</p>
      <p className='space-y-12'><strong>Post:</strong> {underlineField(user.selectedPost)}</p>
    

  <div className="space-y-12">
    {/* Page 1: Personal Info */}
    <section>
      <h3 className="text-xl font-semibold mb-2">Page 1: Personal Information</h3>
      <p><strong>Full Name:</strong> {underlineField(user.fullName)}</p>
      <p><strong>Gender:</strong> {underlineField(user.gender)}</p>
      <p><strong>Permanent Address:</strong> {underlineField(user.permanentAddress)}</p>
      <p><strong>NIC:</strong> {underlineField(user.nic)}</p>
      <p><strong>Telephone:</strong> {underlineField(user.telephoneMobile)} {underlineField(user.telephoneLand)}</p>
      <p><strong>Date of Birth:</strong> {underlineField(user.dob)}</p>
      <p><strong>Civil Status:</strong> {underlineField(user.civilStatus)}</p>
      <p><strong>Citizenship:</strong> {underlineField(user.citizenship)}</p>
      <p><strong>Ethnic Group:</strong> {underlineField(user.ethnicGroup)}</p>
    </section>

    {/* Page 2: OL/AL Results */}
    <section>
      <h3 className="text-xl font-semibold mb-2">Page 2: Educational Qualifications</h3>
      {/* OL First Attempt */}
      <p><strong>O/L First Attempt - Index No.:</strong> {user.ol_index_1} | <strong>Year:</strong> {user.ol_year_1}</p>
      <table className="w-full border text-sm my-2">
        <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
        <tbody>
          {user.ol?.firstAttempt.map((row, i) => (
            <tr key={i}><td>{row.subject}</td><td>{row.grade}</td></tr>
          ))}
        </tbody>
      </table>

      {/* OL Second Attempt */}
      <p><strong>O/L Second Attempt - Index No.:</strong> {user.ol_index_2} | <strong>Year:</strong> {user.ol_year_2}</p>
      <table className="w-full border text-sm my-2">
        <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
        <tbody>
          {user.ol?.secondAttempt.map((row, i) => (
            <tr key={i}><td>{row.subject}</td><td>{row.grade}</td></tr>
          ))}
        </tbody>
      </table>

      {/* AL */}
      <p><strong>A/L - Index No.:</strong> {user.al_index_1} | <strong>Year:</strong> {user.al_year_1}</p>
      <table className="w-full border text-sm my-2">
        <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
        <tbody>
          {user.al.map((row, i) => (
            <tr key={i}><td>{row.subject}</td><td>{row.grade}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    {/* Page 3: Qualifications + Present Occupation */}
    <section>
      <h3 className="text-xl font-semibold mb-2">Page 3: Other Qualifications & Present Occupation</h3>
      <p><strong>University Education:</strong> {underlineField(user.university)}</p>
      <p><strong>Professional Qualifications:</strong> {underlineField(user.professional)}</p>
      <p><strong>Sports Qualifications:</strong> {underlineField(user.sports)}</p>
      <p><strong>Other Qualifications:</strong> {underlineField(user.other)}</p>

      <hr className="my-2" />
      <p><strong>Present Post:</strong> {user.presentPost}</p>
      <p><strong>Place of Work:</strong> {user.placeOfWork}</p>
      <p><strong>Confirmed:</strong> {user.confirmed}</p>
      <p><strong>Salary Scale:</strong> {user.salaryScale}</p>
      <p><strong>Basic Salary:</strong> {user.basicSalary}</p>

      <p className="font-bold mt-4">Grades in Post:</p>
      <table className="w-full border text-sm my-2">
        <thead><tr><th>Date</th><th>Grade</th></tr></thead>
        <tbody>
          {(user.postGrades || []).map((grade, i) => (
            <tr key={i}><td>{grade.date}</td><td>{grade.grade}</td></tr>
          ))}
        </tbody>
      </table>
    </section>

    {/* Page 4: Experience */}
    <section>
      <h3 className="text-xl font-semibold mb-2">Page 4: Experience</h3>
      <p><strong>University Posts:</strong> {user.universityPosts}</p>
      <p><strong>Other Appointments:</strong> {user.priorAppointments}</p>
      <p><strong>Relevant Experience:</strong> {user.relevantExperience}</p>
    </section>

    <div className="flex gap-4 mt-6">
      {!user.isApproved && (
        <button onClick={handleApprove} className="bg-green-600 text-white px-4 py-2 rounded">Approve</button>
      )}
      {user.isApproved && !user.isFinal && (
        <button onClick={handleFinalize} className="bg-blue-600 text-white px-4 py-2 rounded">Finalize</button>
      )}
      <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
    </div>
  </div>
</div>

  );
}

export default AdminUserDetail;
