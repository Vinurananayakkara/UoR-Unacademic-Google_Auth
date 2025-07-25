import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function FinalUsers() {
  const [finalUsers, setFinalUsers] = useState([]);

  useEffect(() => {
    const fetchFinal = async () => {
      try {
        const res = await axios.get('/admin/users', { withCredentials: true });
        const filtered = res.data.filter(user => user.isFinal && !user.isDeleted);
        setFinalUsers(filtered);
      } catch (err) {
        toast.error('Failed to fetch final users');
      }
    };
    fetchFinal();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Final Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {finalUsers.map(user => (
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

export default FinalUsers;
