// Updated AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../axios.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', { withCredentials: true });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`, { withCredentials: true });
      toast.success('User deleted');
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  const handleToggleAdmin = async (id, isAdmin) => {
    try {
      const res = await axios.put(`/admin/users/${id}`, { isAdmin }, { withCredentials: true });
      toast.success('User updated');
      setUsers(users.map(user => user._id === id ? res.data.user : user));
    } catch (err) {
      toast.error('Error updating user');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/user/${id}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="cursor-pointer hover:bg-gray-50">
              <td className="border px-2 py-1 text-blue-600 underline" onClick={() => handleViewDetails(user._id)}>
                {user.name || '-'}
              </td>
              <td className="border px-2 py-1 text-blue-600 underline" onClick={() => handleViewDetails(user._id)}>
                {user.email}
              </td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={() => handleToggleAdmin(user._id, !user.isAdmin)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
