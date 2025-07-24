import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ApprovedUsers() {
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get('/admin/users', { withCredentials: true });
        const filtered = res.data.filter(user => user.isApproved);
        setApprovedUsers(filtered);
      } catch (err) {
        toast.error('Failed to fetch approved users');
      }
    };
    fetchApproved();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Approved Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {approvedUsers.map(user => (
            <tr key={user._id}>
              <td className="border px-2 py-1">
                <Link to={`/admin/user/${user._id}`} className="text-blue-600 hover:underline">{user.name}</Link>
              </td>
              <td className="border px-2 py-1">
                <Link to={`/admin/user/${user._id}`} className="text-blue-600 hover:underline">{user.email}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovedUsers;
