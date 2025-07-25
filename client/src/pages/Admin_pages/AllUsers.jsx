import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/users', { withCredentials: true });
        const filtered = res.data.filter(user =>
          !user.isApproved && !user.isFinal && !user.isDeleted
        );
        setUsers(filtered);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
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

export default AllUsers;
